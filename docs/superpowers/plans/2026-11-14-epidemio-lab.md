# EPIDEMIO LAB Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir e publicar o painel epidemiológico aprovado na conta `fanaiagabi`.

**Architecture:** HTML, CSS e JavaScript estáticos, com gráficos SVG e tabelas acessíveis. Script Python converte somente os quatro CSVs autorizados em JSON preservando valores, sem serviços externos de produção.

**Tech Stack:** HTML, CSS, JavaScript, Python 3.11 padrão, testes Node nativos; GitHub Pages.

**Spec:** `../specs/2026-11-14-epidemio-lab-design.md`.

## Global Constraints

- Conta `fanaiagabi`; repositório público proposto `epidemio-lab`, sem sobrescrever projetos existentes.
- Desenvolvimento em worktree isolada, conforme regra global. Git localizado em `AppData/Local/Programs/Git/cmd/git.exe`; verificar perfil PowerShell para `gwt`.
- Sem framework nem dependência de produção; sem copiar código, marca, textos ou ilustrações do FARMACO LAB.
- Publicar somente três CSVs GBD e um SIM, derivados necessários e código/documentação do projeto; excluir modelos INCA, ZIP, capturas e demais Downloads.
- GBD 2013–2023, quatro localidades, três sexos, todas as idades. Métrica inicial número estimado; Percentual excluído; Taxa somente com unidade documentada.
- SIM separado, agregado 2016–2026 de Mato Grosso, C34, com ressalva sobre completude; sem cruzamentos de distribuições marginais ou filtros GBD sobre SIM.
- Nenhuma autenticação de origem oficial alegada. Intervalos de incerteza somente em 2023. Não calcular letalidade.
- Não afirmar publicação sem verificar resposta HTTP e conteúdo esperado.

## Review Focus

- Zero não é ausência: seleção com valor zero deve exibir zero; valor ausente deve exibir indisponibilidade.
- Hash inválido deve cair em Visão geral sem quebrar a navegação.
- Falha no carregamento JSON deve produzir mensagem visível com tentativa de recarregar, não painel vazio.
- Categorias SIM devem fechar com seus respectivos totais; diferenças devem ficar visíveis sem normalização silenciosa.
- Largura de 375 px e teclado: sem transbordamento da página, controles rotulados e tabelas navegáveis.

---

### Task 1: Dados públicos conferíveis

**Files:** `scripts/prepare_data.py`, `tests/test_data.py`, quatro CSVs em `data/source/`, `data/epidemiologia.json`, `.gitignore`, `README.md`, documentos aprovados em `docs/superpowers/`.

**Interfaces:** `prepare_data.build_data(source_dir: Path) -> dict` retorna `gbd` (linhas com campos originais), `sim` (linhas originais) e `metadata` (cobertura e nomes dos arquivos). O script serializa o resultado em UTF-8. Transformação só de números, sem arredondar os valores de origem.

- [ ] Verificar inexistência de repositório remoto, criar diretório local do projeto e isolamento Git antes de alterações; não substituir conteúdo preexistente.
- [ ] Copiar desenho aprovado e plano para o repositório e registrar checklist.
- [ ] Criar `test_selected_sources_only` e `test_complete_gbd_dimensions`: exatamente quatro fontes, 108 linhas GBD, 26 SIM, 2013–2023 completos, sem chave duplicada por medida/localidade/sexo/métrica.
- [ ] Criar `test_sim_marginal_totals`: sexo, cor/raça, escolaridade e idade somam separadamente 2771 por residência e 2678 por ocorrência; falhar se valores negativos, não finitos ou intervalo de incerteza invertido.
- [ ] Rodar `python -m unittest discover -s tests -v` e confirmar falha pela implementação ainda ausente.
- [ ] Extrair somente os quatro CSVs permitidos, implementar conversão, conferir contagens e investigar capturas localmente para decidir elegibilidade da taxa, sem publicar as capturas.
- [ ] Gerar JSON; rodar os testes e comparar os valores transformados aos originais em todas as linhas.
- [ ] Conferir arquivos versionados e commitar dados/conversão/testes.

### Task 2: Painel responsivo com números consistentes

**Files:** `index.html`, `styles.css`, `app.js`, `data-model.mjs`, `tests/model.test.mjs`.

**Interfaces:** `selectGbd(rows, {measure, location, sex, metric}) -> row | null`; `valueForYear(row, year) -> number | null`; `variation(first, last) -> number | null` (base zero resulta null); `simDistribution(rows, dimension, basis) -> {total, items, difference}`. `app.js` consome esse modelo e o JSON da Task 1.

- [ ] Escrever testes nativos Node para seleção de todas as combinações, zero versus null, variação 100→125 igual a 25, base zero indisponível e separação residência/ocorrência em SIM.
- [ ] Rodar `node --test tests/model.test.mjs`, confirmar falha; implementar funções mínimas do modelo e confirmar aprovação.
- [ ] Construir cinco abas (Visão geral, Incidência, Prevalência, Mortalidade, Fontes), com filtros rotulados, restauração de filtros e links por hash. Preferir Brasil/Ambos/2023 como seleção inicial; séries mostram todos os anos com destaque para o selecionado.
- [ ] Adicionar cartões, gráficos de séries e comparações por sexo/localidade, tabelas equivalentes, unidades e intervalos somente onde existem. Reutilizar mesma seleção e mesma função de formatação em todos os componentes.
- [ ] Implementar seção SIM independente com residência/ocorrência e quatro distribuições separadas; avisar se houver diferença contra os totais.
- [ ] Adicionar glossário curto contextual, fontes de cada gráfico, quatro downloads de CSV, explicação dos arquivos excluídos, cuidados metodológicos e crédito de inspiração visual sem afiliação.
- [ ] Implementar erro de fetch com recarregar, fallback de hash inválido e estados indisponíveis.
- [ ] Verificar em navegador disponível: cinco abas, filtros, restauração, hash inválido, falha de JSON, teclado, 375 px e desktop sem transbordamento; registrar limitações se ferramenta de navegador não estiver disponível.
- [ ] Rodar todos os testes e conferir amostra de indicadores renderizados contra o CSV. Commitar interface e testes.

### Task 3: Publicação verificável

**Files:** documentação de uso/publicação no `README.md`; `.nojekyll` e configuração Pages ou workflow somente se necessário.

**Interfaces:** repositório `fanaiagabi/epidemio-lab`; URL esperada `https://fanaiagabi.github.io/epidemio-lab/`.

- [ ] Rever todo o diff e lista de arquivos para impedir publicação de credenciais, modelos, capturas e dados não autorizados; pedir revisão independente do projeto e corrigir achados comprovados.
- [ ] Rodar testes Python/Node novamente e servir o site localmente; conferir que assets e JSON usam caminhos relativos compatíveis com `/epidemio-lab/`.
- [ ] Criar repositório remoto público após verificar conflitos e publicar somente commits revisados. Não alterar outros repositórios da conta.
- [ ] Ativar GitHub Pages na branch `main` pela integração disponível; usar workflow apenas se necessário e se houver permissão. Se não houver, informar bloqueio exato e passo mínimo de ativação.
- [ ] Conferir resposta HTTP 200 da URL final, título EPIDEMIO LAB, carregamento de assets/JSON e funcionamento básico. Distinguir build pendente de entrega publicada; não anunciar sucesso com 404.
- [ ] Atualizar checklist e entregar links confirmados, resumo de verificações e limitações científicas.

## Revisão do plano

Cobertura conferida com o desenho: filtros, cinco seções, visual próprio, dados elegíveis, exclusões, separação SIM/GBD, incerteza, acessibilidade, testes e publicação contemplados nas três tarefas. Não incluir quizzes, IA, login ou atualização automática.

## Estado

Desenho aprovado. Plano pronto para revisão e escolha de execução; implementação ainda não iniciada.
