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
