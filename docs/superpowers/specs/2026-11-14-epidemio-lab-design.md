# EPIDEMIO LAB — desenho proposto

## Intenção e decisões da usuária

Transformar o ZIP de Epidemiologia em um painel público interativo sobre câncer de pulmão, na conta GitHub `fanaiagabi`, com publicação gratuita no GitHub Pages. A usuária autorizou repositório público e escolheu painel interativo em vez de laboratório com exercícios. Referência visual: https://andrebacchi.github.io/farmaco-lab/ . Não copiar código, marca, textos ou ilustrações da referência.

## Abordagens consideradas

1. Painel de exploração dos dados recebidos: gráficos e filtros, menor produção de conteúdo novo. Escolhido pela usuária.
2. Laboratório didático com quizzes e simuladores: exige criar e revisar material pedagógico; fora do escopo atual.

## Proposta de interface

Nome provisório escolhido pelo agente: EPIDEMIO LAB. Cabeçalho, navegação em abas numeradas, cartões, fundo claro e destaque verde-petróleo; tipografia legível e adaptação ao celular. Sem imagens decorativas necessárias.

- Visão geral: definições curtas de incidência, prevalência e mortalidade, resumo dos três indicadores GBD para a mesma seleção de localidade/sexo/ano e convite à exploração.
- Incidência: evolução anual 2013–2023 e comparação por sexo/localidade para seleção atual.
- Prevalência: mesma organização, sem confundir pessoas vivendo com a doença e novos casos.
- Mortalidade: série GBD e seção separada SIM/TABNET para Mato Grosso.
- Fontes e cuidados: proveniência, cobertura, limitações, arquivos disponibilizados para download e referência visual creditada como inspiração, sem sugerir afiliação.

GBD: filtros de localidade (Global, Brasil, Centro-Oeste, Mato Grosso), sexo (Ambos, Feminino, Masculino) e ano (2013–2023). Todas as idades. Contagens apresentadas como estimativas, arredondadas apenas na exibição. Intervalos de incerteza apenas para 2023, pois os outros anos não possuem limites no CSV. Variação calculada com os valores disponíveis e período explícito; não sugerir inferência causal.

Métrica inicial: número estimado. Incluir taxa por 100 mil somente se a unidade puder ser conferida nas capturas de origem ou documentação; não inferir denominador a partir do nome genérico da coluna. Excluir métrica Percentual por denominador não documentado. Não calcular letalidade por divisão entre óbitos e incidência/prevalência.

Gráficos acompanhados de tabela acessível, rótulos e unidades; não depender só de cores. Controles com labels, foco de teclado e comportamento adequado em telas pequenas. Link direto para cada seção, botão de restaurar filtros e mensagem de erro se os dados falharem ao carregar.

## Contrato dos dados

Entrada local: `Downloads/Epidemiologia-20261114T225131Z-1-001.zip`.

- Três CSVs GBD: 36 linhas cada, quatro localidades × três sexos × três métricas. Anos 2013–2023; limites de incerteza de 2023. Causa: câncer de traqueia, brônquios e pulmão. Tratar como arquivos fornecidos pela usuária, atribuídos ao GBD, sem alegar autenticação ou atualização ao vivo.
- SIM/TABNET: 26 linhas, total de 2.771 óbitos por residência e 2.678 por ocorrência no agregado rotulado 2016–2026. C34, Mato Grosso, base intitulada óbitos por causas evitáveis (5 a 74 anos). Mostrar exatamente o período informado, com aviso de que 2026 pode estar incompleto e sem certificar o fechamento da base. Seletor residência/ocorrência e distribuições separadas por sexo, cor/raça, escolaridade e faixa etária. São marginais, não dados individuais: não oferecer cruzamentos nem filtro GBD sobre SIM, não somar categorias de dimensões diferentes e não comparar diretamente com GBD. Verificar se categorias fecham com os totais; comunicar diferenças se houver.
- Dois CSVs `modelo_mortalidade_cancer_inca_*`: excluir do site e do repositório público, pois trazem valores repetidos e origem não verificada. Exibir nota de exclusão, sem tratá-los como dados oficiais.
- Três TXT de links estão vazios. Não tratá-los como evidência. Links externos para instituições devem ser identificados como portais de consulta, não como prova do recorte recebido.
- Não publicar o ZIP completo, capturas ou outros Downloads. Publicar somente os CSVs GBD/SIM selecionados e derivados agregados necessários. Nenhuma credencial ou informação individual.

## Implementação proposta pelo agente

Site estático em HTML, CSS e JavaScript, sem framework ou dependência de produção. SVG para gráficos, tabelas HTML e JSON local gerado dos quatro CSVs elegíveis, preservando originais e nomes de campos. Um pequeno script Python padrão converte e valida entradas; testes de dados e cálculos com ferramentas padrão, além de teste em navegador se disponível. Não é necessário servidor pago, conta adicional nem domínio próprio. Sem login, IA, coleta de dados, analytics ou persistência remota.

Repositório proposto: `fanaiagabi/epidemio-lab`, após verificar que o nome não conflita. Site esperado: `https://fanaiagabi.github.io/epidemio-lab/`. Se houver projeto existente com esse nome, investigar sem sobrescrever trabalho. Desenvolvimento local isolado em worktree; só commit/push de arquivos explicitamente conferidos. GitHub Pages usando publicação simples de branch quando viável; se faltar permissão de ativação, entregar projeto e instrução exata sem dizer que está publicado.

## Critérios de aceite

- Indicadores e séries conferidos com os CSVs em todos os filtros disponíveis; zero e ausência tratados distintamente.
- Mudanças de filtros atualizam números, gráficos, títulos e tabelas de forma consistente.
- SIM separado do GBD e sem cruzamentos que os dados não suportam.
- Fontes, incerteza, período, unidades, dados excluídos e limitações visíveis.
- Navegação por teclado e ausência de rolagem horizontal da página em celular; tabelas podem ter rolagem interna.
- Testes de transformações/cálculos, integridade de dados e checagem funcional de navegador quando disponível.
- Repositório público contém apenas material autorizado. Publicação confirmada por resposta HTTP e conteúdo esperado; em caso de bloqueio, comunicar precisamente o que falta.

## Fora de escopo e riscos

Sem copiar a referência nem reproduzir o FARMACO LAB; sem exercícios novos, avaliação clínica, conclusões causais ou atualização automática de bases. Não realizar auditoria epidemiológica independente nem afirmar validação oficial do GBD/SIM. A usuária deve revisar cientificamente o material antes de utilizá-lo como fonte acadêmica. Dados agregados e conteúdo do site ficarão públicos, conforme autorizado.

## Estado

Desenho aprovado pela usuária em 14/11/2026, com autorização expressa para construir e publicar. Nenhum projeto ou repositório criado até o registro desta aprovação.
