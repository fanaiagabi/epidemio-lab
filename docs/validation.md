# Validação da primeira publicação — 14/11/2026

Site: https://fanaiagabi.github.io/epidemio-lab/

## Evidências

- `python -m unittest discover -s tests -v`: 4/4 aprovados.
- `node --test tests/model.test.mjs`: 5/5 aprovados.
- `python tests/browser_check.py`: aprovado na raiz local.
- `python tests/browser_check.py http://127.0.0.1:8082/task-epidemio-lab/`: aprovado com assets em subdiretório.
- `python tests/browser_check.py https://fanaiagabi.github.io/epidemio-lab/`: aprovado no site público.
- API Pages e último build: `built`; URL pública HTTP 200 e título EPIDEMIO LAB conferido.
- Checagem funcional: indicadores contra CSV, filtros, restauração, cinco seções, hash inválido, contagem SIM independente, taxas, tela de 375 px sem transbordamento, foco de teclado, erro de rede e recuperação, ausência de exceções JavaScript.
- Revisão independente leu código, desenho, plano e dados e repetiu os testes; nenhum problema crítico ou importante.
- Auditoria da lista pública: exatamente quatro CSVs selecionados, sem ZIP, capturas, modelos INCA, dados individuais ou credenciais.

## Decisões registradas durante a execução

1. Ferramenta de mudança de diretório da sessão não interpretou caminhos Windows; ferramentas operaram com caminhos absolutos. Risco: comandos futuros precisam indicar a worktree.
2. `gwt` criou worktree órfã para o repositório vazio; primeiro commit feito na worktree, nunca na raiz. Nenhum código anterior afetado.
3. Controle das tarefas adaptado para Markdown no Windows em vez dos auxiliares Bash. Sem impacto no produto.
4. Taxas incluídas porque as três capturas recebidas indicam por 100 mil habitantes. Risco: não houve autenticação da extração oficial nem comprovação de ajuste por idade.
5. Capturas usadas apenas para conferir unidade; sem republicação de imagens ou logos, sem afiliação institucional. A ciência dos dados ainda requer revisão.
6. Exatidão epidemiológica não certificada: preservar valores recebidos e avisar limites em vez de modificá-los. Risco: uso acadêmico exige validação adicional.
7. Faixas SIM de 5–19 anos não foram inventadas, pois não constam no arquivo. As categorias exibidas fecham com o total; ausência de categorias não comprova zero risco.
8. Navegação durante falha de carga mantém o erro visível; após tentar novamente, aplica a seção escolhida. Não apresenta painel vazio como se fosse válido.
9. Publicação foi validada pelo implementador após a revisão, por HTTP, API e Chromium público, em vez de supor que o deploy funcionou.
10. Publicação inicial em `main` autorizada expressamente pela usuária, em repositório novo. Sem PR adicional nem alteração de outros projetos; worktree de desenvolvimento preservada.

## Melhorias menores adiadas

- O teste de 2013 verifica ausência de intervalo de incerteza; ausência de valor numérico está coberta no modelo, não no navegador, porque a base atual está completa.
- Se no futuro houver valor ausente em uma barra, o rótulo será indisponível mas o preenchimento será zero; distinguir graficamente nessa evolução.
- `unit()` pressupõe as três medidas fixas atuais; rever se forem adicionadas medidas novas.
- Rótulos auxiliares de 8–9 px no celular podem ser ampliados para melhor legibilidade.

## Não verificado

Revisão científica, contraste WCAG calculado, leitores de tela reais, Safari e Firefox. Não há atualização automática das bases.

## Atualização: modo escuro

Tema escuro fixo solicitado pela usuária. Alterados somente cores CSS, cor da barra do navegador e testes de apresentação; sem alterações nas bases ou cálculos. Não foi adicionado seletor de tema nem armazenamento de preferências.

Teste de navegador ampliado: esquema escuro mesmo com preferência do sistema clara; superfícies escuras nas cinco seções, controles e tabelas; contraste calculado mínimo de 4,5:1 para os pares de texto/fundo dos componentes explicitamente testados. Não equivale a auditoria WCAG integral. A asserção do esquema falhou antes da mudança e passou depois. Suítes Python/Node e fluxo funcional mantidos.

### Correção para visitantes com estilos antigos em cache

GitHub Pages respondeu `Cache-Control: max-age=600`, e o HTML reutilizava a URL `styles.css` da versão clara. O teste `python tests/cache_check.py` reproduziu o problema mantendo o cache real do Chromium: após carregar a versão clara e receber HTML novo, o tema permaneceu claro sem nova solicitação do CSS. O link foi versionado como `styles.css?v=dark-1`; o mesmo teste passou sem limpar cache. O HTML também pode permanecer temporariamente em cache; abrir `?v=dark-1` no endereço da página força uma URL nova para ele. Não foi possível inspecionar diretamente o navegador da usuária.

## Versão 1.1 — conteúdo educativo — 15/11/2026

Desenho e execução aprovados na conversa. Nova aba `#entenda`, cinco grupos de conteúdo (risco/prevenção, tipos/biomarcadores, diagnóstico/estadiamento, princípios de tratamento, perguntas expansíveis) e bibliografia compartilhada com Fontes. Conteúdo editorial estático no HTML; sem dependências novas. `data/` e `data-model.mjs` permanecem sem alterações contra `2bbaaaa`.

### Leitura e decisões editoriais

- Oito PDFs recentes representam cinco documentos únicos; quatro cópias byte a byte do artigo Medicine foram deduplicadas. PDFs antigos sem relação ficaram fora do escopo.
- Tahayneh, Idkedek e Abu Akar: J. Clin. Med. 2025;14:1025, DOI `10.3390/jcm14031025`, publicado em 06/02/2025; Alduais et al.: Medicine 2023;102:e32899, DOI `10.1097/MD.0000000000032899`. Ambas revisões narrativas, CC BY 4.0; citadas como apoio, não como protocolos.
- DDT: Portaria SAS/MS 957, 26/09/2014. Identificada como contexto histórico. Não certificamos vigência jurídica, disponibilidade no SUS ou atualidade das condutas.
- SBOC/GBOT 2026: recebido arquivo v7, conferida versão oficial v8, data impressa 23/06/2026. Comparação de texto extraído mostrou mudança de data e correção de M1b de IVB para IVA na tabela. A tabela não foi copiada e o painel não calcula estadiamento. Comparação textual não audita figuras/metadados.
- Material de ensino: usados somente temas gerais para perguntas originais. Nenhum identificador ou narrativa do paciente incluído no produto; autoria e autorização de redistribuição desconhecidas. Nenhum PDF recebido ou extração entrou no repositório.
- Não adicionadas doses, esquemas prescritivos, estimativas INCA ausentes ou percentuais clínicos sem contexto. Avisos distinguem rastreamento de diagnóstico, revisão de diretriz e recomendação de disponibilidade regulatória/assistencial.
- Conteúdo e privacidade foram inspecionados editorialmente contra as leituras; não usamos asserções de redação como falsa prova de exatidão clínica. Sem revisão médica especializada.

### Evidência local

- Teste HTML e teste de navegação falharam antes da implementação por ausência de `#entenda`; passaram após a inclusão.
- `python -m unittest discover -s tests -v`: 5/5; `node --test tests/model.test.mjs`: 5/5.
- `python tests/browser_check.py`: PASS em Chromium, seis abas, acesso direto/reload, bibliografia nas duas seções, filtros ocultos na leitura e preservados no retorno, respostas por teclado, contraste dos componentes testados e 375 px com respostas abertas sem overflow; sem exceções JavaScript. Capturas locais `test-results/education-desktop.png` e `education-mobile.png` inspecionadas.
- `python tests/cache_check.py`: PASS nos dois cenários reais, claro→escuro e versão `3e7de3a`→educativa. No segundo, a nova aba permaneceu oculta com o JavaScript antigo antes do versionamento; passou com CSS e script principal `?v=education-1`, sem apagar ou desabilitar cache.
- `git diff --check`: sem erros; avisos Git de normalização LF/CRLF no Windows não são falha de teste.
- Publicação ainda pendente nesta anotação; resultado público será registrado após deploy e teste real.

### Resultado público confirmado

Publicação validada em 15/11/2026: push fast-forward `3e7de3a..02d8d60` para `origin/main`; API GitHub Pages `built` no commit `02d8d604e2359a4585d080faedb06b3f91a0e1fb`, sem erro. HTTP 200 com nova seção e script `app.js?v=education-1` no HTML. `python tests/browser_check.py 'https://fanaiagabi.github.io/epidemio-lab/?v=education-1'`: PASS no site público, seis abas, acesso direto/reload, referências compartilhadas, dark mode, 375 px sem overflow com respostas abertas, teclado, KPIs preservados, erro de rede/recuperação e nenhuma exceção JavaScript.

Primeira tentativa de verificação durante a propagação usou uma página aberta antes do build: o fetch sem cache detectou HTML novo, mas reload daquela navegação ainda apresentou HTML antigo. Nova execução em navegador limpo após `built` passou; não houve mudança de produto para mascarar a falha. URL de entrega: https://fanaiagabi.github.io/epidemio-lab/?v=education-1#entenda.

### Decisões de execução desta versão

1. Texto clínico, datas e privacidade conferidos editorialmente, sem testes frágeis de redação; testes automatizados cobrem links, IDs e comportamento. Risco: mudanças de texto exigem nova revisão editorial.
2. Publicação ficou depois da revisão independente, embora a ordem do plano a listasse antes. Sem risco ao produto; a validação pública ocorreu após o gate.
3. Exatidão médica além do cruzamento documental não certificada: conteúdo educativo, datas e limites explícitos, sem doses. Uso clínico/acadêmico requer revisão especializada.
4. Paginação dos tópicos conferida pelo implementador pelos marcadores físicos das extrações, não pelo revisor; números do visualizador podem diferir.
5. Acessibilidade além dos componentes/browsers testados não certificada; problemas específicos de tecnologia assistiva ou navegador ainda podem existir.
6. Meta description permanece epidemiológica por ser a nova seção complementar; resumo em buscadores pode não mencionar a leitura educativa.

## Versão 1.2 — glossário e carga tabágica — 15/11/2026

Usuária autorizou aplicação direta e pediu ambas as visualizações. Botões globais “Glossário” e “Carga tabágica” abrem diálogos em dark mode, sem depender da disponibilidade do JSON epidemiológico.

- Glossário: 21 termos presentes no painel/leituras, definições próprias resumidas e busca insensível a acentos/maiúsculas. Referências educativas existentes mantidas; definição NCI de pack-year vinculada como leitura adicional (página depende de renderização e não foi usada como prova de acesso ao texto pelo fetch).
- Calculadora: `(cigarros/dia ÷ 20) × anos`, exemplo identificado 10×20=10 maços-ano. Valida vazio/negativo/não finito/overflow, aceita frações e zero. Apenas média diária constante; pausas/mudanças de consumo e outros produtos não são convertidos.
- Blocos fracionados, agrupados quando necessário em potências de 10 (até 40 elementos), com escala explícita. Linha do tempo e tabela em cinco pontos mostram o mesmo total/duração; eixos ajustados ao exemplo, não faixas clínicas. Nenhuma interpretação de dano/risco, limite seguro ou critério automático de rastreamento.
- Animações breves, checkbox “Sem animação” e preferência de movimento reduzido; texto e tabela independentes da animação. Sem salvamento de campos ou chamadas de rede durante o uso (testado).
- Cabeçalho visível ao reabrir, Escape fecha mesmo em busca preenchida, foco retorna ao botão de origem. Erros de dados epidemiológicos não impedem abrir as ferramentas.

### Evidências locais

Commit de implementação `53efe6f`. Testes novos falharam antes do produto por módulo/botão ausente. Regressão de cache education-1→study-1 falhou com app antigo antes de versionar CSS/app e passou depois. Regressão de reabertura falhou com scroll deslocado, passou com reset do scroll.

- `python -m unittest discover -s tests -v`: 5/5.
- `node --test tests/model.test.mjs tests/study.test.mjs`: 7/7, incluindo frações, zeros, negativos, não finitos, tipos inválidos e overflow.
- `python tests/study_check.py`: PASS, exemplo, fração .625, totais 400/404 com agrupamento, zero/duração zero, inválidos, restauração, pesquisa/sem resultado, foco/Escape, checkbox e reduced-motion, 375/720/1440 px sem overflow, ferramentas com falha JSON, campos sem rede/storage.
- `python tests/browser_check.py`: PASS, funcionalidades anteriores/teclado/dark mode/375 px e KPIs preservados.
- `python tests/cache_check.py`: PASS, três cenários de cache real: claro→escuro, versão inicial→educativa, educativa→ferramentas.
- Capturas locais `test-results/smoking-1440.png`, `smoking-375.png`, `glossary-375.png` inspecionadas.
- `git diff --check`: sem erros; `git diff --exit-code ed4789f -- data data-model.mjs`: vazio.

Revisão independente e publicação ainda pendentes nesta anotação. Sem revisão médica especializada, WCAG integral, leitor de tela real, Safari ou Firefox; limitações anteriores continuam.

Conferência editorial adicional: NCI, “Harms of Cigarette Smoking and Health Benefits of Quitting” (página revisada em 19/12/2017, acessada em 15/11/2026): cessação reduz riscos mesmo em idades mais avançadas e não há nível seguro de consumo. Não extraímos percentuais para a calculadora nem inferimos queda de exposição acumulada após parar. https://www.cancer.gov/about-cancer/causes-prevention/risk/tobacco/cessation-fact-sheet.

### Revisão independente pré-publicação

Revisão do range `91f914f..e41fb4c`: nenhum achado crítico ou importante; parecer favorável à publicação. Repetiu Python 5/5, Node 5/5, navegador e os dois cenários de cache. Conferiu data, edição TNM e escopo da SBOC v8, sem certificar exatidão médica de toda a prosa. Paginação indicada nos cards conferida pelo implementador com os marcadores de página das extrações (contagem física dos PDFs), não por auditoria do revisor.

Melhorias menores adiadas: conteúdo educativo estático depende do carregamento do JSON epidemiológico, assim como Fontes (se falhar, há erro e botão de nova tentativa); indentação de dois links da navegação é apenas cosmética. Verificação adicional do implementador em 441, 720 e 999 px, com respostas abertas: sem overflow. Descrição de busca permanece epidemiológica; a nova seção é complementar. Limites científicos e de acessibilidade continuam os declarados acima.

### Limites desta atualização

Sem auditoria WCAG integral, leitores de tela reais, Safari ou Firefox; contraste verificado apenas nos componentes selecionados pelo teste. As fontes clínicas e os links não têm atualização automática. Revisão de código não equivale a validação médica.
