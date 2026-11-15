import {selectGbd, valueForYear, variation, simDistribution} from './data-model.mjs';
import {initStudyTools} from './study-tools.mjs?v=study-1';

const $ = id => document.getElementById(id);
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const format = (value, digits=0) => value === null || !Number.isFinite(value) ? 'Indisponível' : value.toLocaleString('pt-BR', {minimumFractionDigits:digits, maximumFractionDigits:digits});
const measures = {
  incidencia:{name:'Incidência', description:'Novos casos estimados no ano selecionado.', unit:'novos casos estimados', icon:'↗'},
  prevalencia:{name:'Prevalência', description:'Pessoas vivendo com a doença no ano selecionado.', unit:'casos prevalentes estimados', icon:'◎'},
  mortalidade:{name:'Óbitos', description:'Mortes estimadas pela doença no ano selecionado.', unit:'óbitos estimados', icon:'—'},
};
const sections = {
  'visao-geral':['PANORAMA EPIDEMIOLÓGICO','O cenário em números'],
  incidencia:['NOVOS CASOS','Incidência: o início de cada história'],
  prevalencia:['PESSOAS VIVENDO COM A DOENÇA','Prevalência: além dos novos casos'],
  mortalidade:['ESTIMATIVAS E REGISTROS','Mortalidade: duas bases, diferentes recortes'],
  entenda:['DOS DADOS AO CUIDADO','Entenda o câncer de pulmão'],
  fontes:['TRANSPARÊNCIA E CONTEXTO','Fontes, conceitos e cuidados'],
};
let data;
let active = 'visao-geral';
let simBasis = 'Residencia';
const state = () => ({location:$('location').value, sex:$('sex').value, year:Number($('year').value), metric:$('metric').value});
const rowFor = (measure, override={}) => selectGbd(data.gbd, {...state(), measure, ...override});
const digits = () => state().metric === 'Taxa' ? 2 : 0;
const unit = measure => state().metric === 'Taxa' ? 'por 100 mil habitantes' : Object.values(measures).find(m=>m.name===measure).unit;
const note = text => `<div class="notice"><span class="badge-icon" aria-hidden="true">i</span><p>${text}</p></div>`;

function uncertainty(row) {
  if (state().year !== 2023) return 'UI 95% não disponível para este ano.';
  return row ? `UI 95%: ${format(row.UI_95_Inf_2023,digits())} – ${format(row.UI_95_Sup_2023,digits())}` : 'UI 95% indisponível.';
}

function kpiCards() {
  return `<div class="kpi-grid">${Object.entries(measures).map(([key,m])=>{
    const row = rowFor(m.name);
    const value = valueForYear(row,state().year);
    const change = variation(valueForYear(row,2013),value);
    const delta = change === null ? 'Indisponível' : `${change > 0 ? '+' : ''}${format(change,1)}%`;
    return `<article class="card kpi ${key}" data-kpi="${m.name}"><div class="kpi-top"><span class="kpi-title">${m.name === 'Óbitos' ? 'Mortalidade' : m.name}</span><span class="kpi-icon" aria-hidden="true">${m.icon}</span></div><div class="kpi-value">${format(value,digits())}</div><div class="kpi-unit">${unit(m.name)}</div><p class="uncertainty">${uncertainty(row)}</p><div class="kpi-trend"><span class="delta">${delta}</span><span>${state().year === 2013 ? 'ano inicial da série' : `variação · 2013–${state().year}`}</span></div></article>`;
  }).join('')}</div>`;
}

function table(headers, rows, caption, selectedIndex=-1) {
  return `<div class="table-scroll" tabindex="0" role="region" aria-label="${escapeHtml(caption)}"><table class="data-table"><caption>${escapeHtml(caption)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r,i)=>`<tr${i===selectedIndex?' class="highlight"':''}>${r.map((v,j)=>`<${j?'td':'th'}${j?'':' scope="row"'}>${escapeHtml(v)}</${j?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function lineChart(row, title) {
  const years = data.metadata.years;
  const values = years.map(y=>valueForYear(row,y));
  const finite = values.filter(v=>v!==null);
  if (!finite.length) return '<p class="notice">Não há série disponível para esta seleção.</p>';
  const max = Math.max(...finite,1)*1.12;
  const x = i => 64 + i*48;
  const y = v => 217 - v/max*180;
  let path='';
  let connected=false;
  values.forEach((v,i)=>{ if(v===null) connected=false; else {path+=`${connected?'L':'M'}${x(i)},${y(v)} `;connected=true;} });
  const tickLabel = v => v>=1000000 ? `${format(v/1000000,1)} mi` : v>=1000 ? `${format(v/1000,1)} mil` : format(v,state().metric==='Taxa'?1:0);
  const selected = years.indexOf(state().year);
  return `<svg class="chart" viewBox="0 0 570 253" role="img" aria-label="${escapeHtml(title)}. Valores completos na tabela abaixo."><title>${escapeHtml(title)}</title>${[0,1,2,3,4].map(i=>{const v=max*i/4;return `<line class="gridline" x1="64" x2="544" y1="${y(v)}" y2="${y(v)}"/><text x="54" y="${y(v)+4}" text-anchor="end">${tickLabel(v)}</text>`;}).join('')}<path class="area" d="${path}L544,217 L64,217Z"/><line class="focus-line" x1="${x(selected)}" x2="${x(selected)}" y1="22" y2="217"/><path class="curve" d="${path}"/>${values.map((v,i)=>v===null?'':`<circle class="${i===selected?'selected':'dot'}" cx="${x(i)}" cy="${y(v)}" r="${i===selected?5:3}"><title>${years[i]}: ${format(v,digits())} ${unit(row.Medida)}</title></circle>`).join('')}${years.map((year,i)=>`<text x="${x(i)}" y="240" text-anchor="middle">${String(year).slice(2)}</text>`).join('')}</svg>`;
}

function seriesCard(measure) {
  const row = rowFor(measure);
  const s = state();
  const label = `${measure} · ${s.location} · ${s.sex} · ${unit(measure)}`;
  const rows = data.metadata.years.map(y=>[String(y),format(valueForYear(row,y),digits()),y===2023&&row?`${format(row.UI_95_Inf_2023,digits())} – ${format(row.UI_95_Sup_2023,digits())}`:'Não disponível']);
  return `<article class="card"><div class="card-heading"><div><h3>Evolução da ${measure==='Óbitos'?'mortalidade':measure.toLowerCase()}</h3><p>${s.location} · ${s.sex==='Ambos'?'Ambos os sexos':s.sex} · Todas as idades</p></div><span class="pill">2013 — 2023</span></div>${lineChart(row,label)}<div class="chart-note"><span class="chart-key">${unit(measure)}</span><span>Eixo horizontal: anos de 2013 a 2023 · destaque: ${s.year}</span></div><details class="tables"><summary>Ver os valores em tabela</summary>${table(['Ano',s.metric==='Taxa'?'Taxa por 100 mil':'Número estimado','UI 95%'],rows,label,data.metadata.years.indexOf(s.year))}</details><p class="source-note">Fonte atribuída: GBD Results · arquivo fornecido para estudo. Contagens são estimativas, não registros individuais.</p></article>`;
}

function readingCard() {
  return `<aside class="card reading"><div class="eyebrow">UM MINUTO DE CONTEXTO</div><h3>Três indicadores.<br>Três perguntas diferentes.</h3><p>Antes de comparar os números, entenda o que cada um representa.</p><div class="definition"><b>↗ Incidência</b><p>Quantos novos casos surgem no período?</p></div><div class="definition"><b>◎ Prevalência</b><p>Quantas pessoas vivem com a doença?</p></div><div class="definition"><b>— Mortalidade</b><p>Quantas mortes são atribuídas à doença?</p></div><a class="text-link" href="#fontes">Entenda as fontes e limitações ↗</a></aside>`;
}

function comparisonCard(measure, dimension) {
  const s=state();
  const sex=dimension==='sex';
  const labels=sex?['Masculino','Feminino']:['Global','Brasil','Centro-Oeste','Mato Grosso'];
  const items=labels.map(label=>({label,value:valueForYear(rowFor(measure,{[sex?'sex':'location']:label}),s.year)}));
  const max=Math.max(...items.map(r=>r.value??0),1);
  const title=sex?'Comparação por sexo':'Quatro escalas, um indicador';
  const caption=`${measure} · ${s.year} · ${sex?s.location:s.sex} · ${unit(measure)}`;
  return `<article class="card"><h3>${title}</h3><p class="card-subtitle">${sex?s.location:s.sex==='Ambos'?'Ambos os sexos':s.sex} · ${s.year} · ${unit(measure)}</p><div class="bar-list" aria-hidden="true">${items.map(r=>`<div class="bar-row"><span class="${r.label===(sex?s.sex:s.location)?'selected-label':''}">${r.label}</span><b>${format(r.value,digits())}</b><div class="bar-track"><div class="bar-fill" style="width:${(r.value??0)/max*100}%"></div></div></div>`).join('')}</div>${table([sex?'Sexo':'Localidade',s.metric==='Taxa'?'Taxa por 100 mil':'Número estimado'],items.map(r=>[r.label,format(r.value,digits())]),caption)}<p class="source-note">${sex?'As estimativas de ambos os sexos não são uma média simples.':'Localidades têm populações diferentes. Contagens não medem risco individual; taxas de todas as idades também não eliminam diferenças de estrutura etária.'}</p></article>`;
}

function renderGbd() {
  const overview=active==='visao-geral';
  const measure=overview?'Incidência':measures[active].name;
  $('gbd-content').innerHTML=`${kpiCards()}<div class="dashboard-grid">${seriesCard(measure)}${readingCard()}</div>${overview?'':`<div class="comparison-grid">${comparisonCard(measure,'sex')}${comparisonCard(measure,'location')}</div>`}${note('<strong>Leia com contexto.</strong> Estimativas atribuídas ao GBD, fornecidas para estudo e sem autenticação da extração oficial. Todas as idades · intervalos de incerteza apenas em 2023. A variação descreve a série; não demonstra causa nem risco individual.')}`;
}

function renderSim() {
  const selected=simDistribution(data.sim,'Sexo',simBasis);
  const basisLabel=simBasis==='Residencia'?'residência':'ocorrência';
  $('sim-section').innerHTML=`<div class="section-divider sim-header"><div><div class="eyebrow">OUTRA BASE · OUTRO RECORTE</div><h2>Um olhar sobre Mato Grosso</h2><p class="card-subtitle">SIM / TABNET · C34 · Óbitos por causas evitáveis, 5 a 74 anos</p></div><label class="sim-controls">Contagem SIM<select id="sim-basis"><option value="Residencia"${simBasis==='Residencia'?' selected':''}>Por residência</option><option value="Ocorrencia"${simBasis==='Ocorrencia'?' selected':''}>Por ocorrência</option></select></label></div>${note('<strong>Período informado no arquivo: 2016–2026.</strong> O ano de 2026 pode estar incompleto; o fechamento da base não foi verificado. Este agregado não é uma série anual e não é diretamente comparável ao GBD. Os filtros GBD acima não se aplicam a esta seção.')}<div class="sim-summary"><b id="sim-total">${format(selected.total)}</b><span>óbitos por ${basisLabel}<br>Mato Grosso · agregado 2016–2026 informado no arquivo</span></div><div class="sim-grid">${[['Sexo','Distribuição por sexo'],['Cor_Raca','Distribuição por cor/raça'],['Escolaridade','Distribuição por escolaridade'],['Faixa_Etaria','Distribuição por faixa etária']].map(([field,title])=>{
    const {total,items,difference}=simDistribution(data.sim,field,simBasis);
    const max=Math.max(...items.map(r=>r.value),1);
    return `<article class="card"><h3>${title}</h3><p class="card-subtitle">Óbitos por ${basisLabel} · percentual sobre ${format(total)} óbitos</p><div class="bar-list" aria-hidden="true">${items.map(r=>`<div class="bar-row"><span>${escapeHtml(r.label)}</span><b>${format(r.value)} <em>${total?format(r.value/total*100,1)+'%':'Indisponível'}</em></b><div class="bar-track"><div class="bar-fill" style="width:${r.value/max*100}%"></div></div></div>`).join('')}</div><details class="tables"><summary>Ver distribuição em tabela</summary>${table(['Categoria','Óbitos','Percentual'],items.map(r=>[r.label,format(r.value),total?format(r.value/total*100,2)+'%':'Indisponível']),`${title} · SIM/TABNET · ${basisLabel} · 2016–2026`)}</details><p class="source-note">${difference===0?'Categorias somam o total desta base.':`Atenção: diferença de ${format(difference)} óbitos entre o total e as categorias disponíveis.`}</p></article>`;
  }).join('')}</div>${note('<strong>Distribuições independentes.</strong> Não é possível cruzar sexo, cor/raça, escolaridade e idade com este arquivo. Não some os totais de dimensões diferentes. Contagens e percentuais de óbitos não representam o risco de morrer de cada grupo.')}`;
  $('sim-basis').addEventListener('change',event=>{
    simBasis=event.target.value;
    renderSim();
    $('sim-basis').focus();
  });
}

function renderSources() {
  const downloadLabels=['GBD · Incidência','GBD · Prevalência','GBD · Óbitos','SIM / TABNET · Mato Grosso'];
  $('sources-section').innerHTML=`${note('<strong>Transparência primeiro.</strong> Este painel organiza arquivos fornecidos pela responsável pelo projeto. A atribuição ao GBD e ao SIM/TABNET vem do material recebido; não houve autenticação independente da extração oficial nem revisão científica.')}<div class="source-grid"><article class="card prose"><h3>O que está sendo apresentado</h3><p><strong>GBD:</strong> câncer de traqueia, brônquios e pulmão, todas as idades; anos de 2013 a 2023, Global, Brasil, Centro-Oeste e Mato Grosso, ambos os sexos, feminino e masculino. São estimativas, apresentadas como números ou taxas por 100 mil habitantes. A unidade das taxas consta nas três capturas recebidas; não foi comprovado ajuste por idade.</p><p><strong>SIM / TABNET:</strong> Mato Grosso, C34 (neoplasia maligna dos brônquios e dos pulmões), base identificada como óbitos por causas evitáveis de 5 a 74 anos. Período agregado rotulado 2016–2026, sujeito a incompletude e revisão. Contagem por residência é diferente da contagem pelo local de ocorrência.</p><h3>Como ler os números</h3><ul><li><strong>Número estimado:</strong> dimensão absoluta da doença, influenciada pelo tamanho e composição da população. Valores decimais nas fontes resultam de estimativas.</li><li><strong>Taxa:</strong> valor por 100 mil habitantes. Não é a probabilidade individual de adoecer ou morrer. Comparar taxas de todas as idades exige considerar a estrutura etária.</li><li><strong>UI 95%:</strong> intervalo de incerteza fornecido para 2023. Não há limites nos arquivos dos demais anos. Não é prova de diferença estatística entre grupos.</li><li><strong>Variação:</strong> (valor no ano selecionado − valor em 2013) ÷ valor em 2013 × 100. Cálculo usa valores não arredondados. Base zero gera indisponibilidade.</li><li><strong>Percentual SIM:</strong> proporção de cada categoria no total de óbitos da base selecionada; não é uma taxa populacional.</li></ul><h3>O que não devemos concluir</h3><p>Não comparar diretamente GBD e SIM: há diferenças de causa, idade, período e metodologia. Não dividir óbitos por incidência ou prevalência para obter letalidade. Não somar indicadores nem inferir causas, eficácia de tratamento ou risco individual a partir destas séries.</p><h3>Arquivos excluídos</h3><p>Os dois CSVs identificados como <code>modelo_mortalidade_cancer_inca</code> não foram usados nem publicados: contêm valores repetidos e origem não confirmada. Os percentuais GBD foram omitidos por falta de documentação do denominador. Três arquivos TXT de links estavam vazios. ZIP e capturas não foram republicados.</p></article><aside><article class="card"><div class="eyebrow">DADOS ABERTOS NESTE PROJETO</div><h3 style="margin-top:9px">Confira os arquivos utilizados</h3><p class="card-subtitle">CSV originais recebidos, sem correção dos números. A disponibilização não certifica sua origem oficial.</p><div class="downloads">${data.metadata.files.map((file,i)=>`<a class="download" href="./data/source/${encodeURIComponent(file)}" download><span>${downloadLabels[i]}<small>CSV · ${i===3?'26 linhas · período agregado':'36 linhas · 2013–2023'}</small></span><span aria-hidden="true">↓</span></a>`).join('')}</div></article><article class="card prose" style="margin-top:18px"><h3>Portais para conferência</h3><p>Estes links levam às instituições, não certificam o recorte recebido:</p><ul><li><a href="https://vizhub.healthdata.org/gbd-results/">GBD Results · IHME ↗</a></li><li><a href="https://datasus.saude.gov.br/informacoes-de-saude-tabnet/">TABNET · DATASUS ↗</a></li><li><a href="https://www.inca.gov.br/">INCA ↗</a></li></ul><p>Antes de citar academicamente, confira o arquivo de origem, os filtros da consulta, as condições de uso e a data de extração.</p></article><article class="card prose" style="margin-top:18px"><h3>Sobre o projeto</h3><p>EPIDEMIO LAB é um projeto educativo independente. Não oferece orientação clínica, não coleta dados pessoais e não atualiza as bases automaticamente.</p><p>Organização visual inspirada no <a href="https://andrebacchi.github.io/farmaco-lab/">FARMACO LAB, de André D. Bacchi</a>. Interface, código e textos próprios; sem afiliação ou endosso das instituições citadas.</p></article></aside></div>`;
}

function render() {
  document.querySelectorAll('.section-nav a').forEach(a=>{
    if(a.hash===`#${active}`) a.setAttribute('aria-current','page');
    else a.removeAttribute('aria-current');
  });
  $('section-kicker').textContent=sections[active][0];
  $('section-title').textContent=sections[active][1];
  const s=state();
  const editorial=active==='fontes'||active==='entenda';
  $('context').textContent=active==='entenda'?'Leituras 2023–2026 · Síntese educativa':active==='fontes'?'Fontes, cobertura e limitações':`${s.location} · ${s.sex==='Ambos'?'Ambos os sexos':s.sex} · ${s.year} · Todas as idades`;
  $('filters').hidden=editorial;
  $('gbd-content').hidden=editorial;
  $('sim-section').hidden=active!=='mortalidade';
  $('sources-section').hidden=active!=='fontes';
  $('education-section').hidden=active!=='entenda';
  $('education-references').hidden=!editorial;
  if(active==='fontes') renderSources(); else if(!editorial) renderGbd();
  if(active==='mortalidade') renderSim();
}

function navigate() {
  const hash=location.hash.slice(1);
  active=Object.hasOwn(sections,hash)?hash:'visao-geral';
  if(data) render();
}

async function load() {
  $('load-status').hidden=false;
  $('load-status').setAttribute('role','status');
  $('load-status').textContent='Carregando os dados do painel…';
  try {
    const response=await fetch(new URL('./data/epidemiologia.json',import.meta.url));
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    data=await response.json();
    if(!Array.isArray(data.gbd)||!Array.isArray(data.sim)||!Array.isArray(data.metadata?.years)) throw new Error('Formato de dados inválido');
    navigate();
    $('content').hidden=false;
    $('load-status').hidden=true;
  } catch(error) {
    $('content').hidden=true;
    $('filters').hidden=true;
    $('load-status').setAttribute('role','alert');
    $('load-status').innerHTML='<div>Não foi possível carregar os dados. Verifique a conexão e tente novamente. <button class="button" id="retry">Tentar novamente</button></div>';
    $('retry').addEventListener('click',load);
    console.warn('Falha ao carregar EPIDEMIO LAB:',error.message);
  }
}

['location','sex','year','metric'].forEach(id=>$(id).addEventListener('change',()=>{if(data)render();}));
$('reset').addEventListener('click',()=>{
  $('location').value='Brasil';$('sex').value='Ambos';$('year').value='2023';$('metric').value='Número';
  if(data)render();
});
window.addEventListener('hashchange',navigate);
initStudyTools();
navigate();
load();
