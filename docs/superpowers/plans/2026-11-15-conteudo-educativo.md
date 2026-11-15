# Conteúdo educativo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar a seção “Entenda o câncer de pulmão”, com síntese educativa e referências dos PDFs recebidos, sem alterar os dados epidemiológicos.

**Architecture:** Reutilizar navegação por hash, cartões e tema escuro existentes. Conteúdo editorial estático em `index.html`, seção controlada por `render()` em `app.js`; bibliografia única no HTML, visível tanto na aba educativa quanto em Fontes. Nenhum cálculo ou modelo epidemiológico muda.

**Tech Stack:** HTML, CSS, JavaScript nativos; Python unittest, Node test e Playwright/Chromium já disponíveis para testes.

**Spec:** `docs/superpowers/specs/2026-11-15-conteudo-educativo-design.md`

## Global Constraints

- Não alterar séries, números, filtros ou cálculos GBD/SIM. Filtros epidemiológicos não se aplicam à nova seção.
- Não hospedar PDFs originais, copiar figuras/tabelas ou publicar dados do caso clínico.
- Não acrescentar doses, prescrições, calculadora de estadiamento, recomendações individuais ou estimativas INCA ausentes nas fontes.
- Identificar a DDT como documento de 2014, não como orientação clínica atual nem como vigência jurídica comprovada.
- Referenciar a SBOC 2026 v8, cuja data impressa é 23/06/2026; não copiar a tabela de estadiamento da v7 recebida. Explicações gerais devem indicar que a edição TNM importa.
- Manter HTML/CSS/JavaScript estáticos, sem dependências ou backend novos.
- Publicação só é declarada concluída após confirmar o conteúdo novo e o dark mode no endereço público.

## Review Focus

- Acesso direto e recarregamento de `#entenda` devem mostrar a nova seção, não o panorama ou erro de renderização.
- Trocar entre Entenda, Fontes e epidemiologia deve esconder conteúdo/filtros indevidos e preservar as seleções GBD.
- Respostas expansíveis e textos/referências longos devem funcionar por teclado e caber em 375 px.
- HTML novo com CSS/JavaScript antigos em cache não deve quebrar a nova rota nem trazer tema claro.
- Fontes datadas e material clínico privado não devem virar conselho atual ou narrativa identificável nos arquivos públicos.

---

### Task 1: Seção educativa e bibliografia integrada

**Files:**
- Modify: `index.html` — nova aba/seções editoriais e versão 1.1.
- Modify: `app.js:11-17,111-126` — rota e visibilidade.
- Modify if needed: `styles.css` — seis abas responsivas e texto editorial.
- Test: `tests/browser_check.py`; Create: `tests/test_education.py`.

**Interfaces:**
- Consumes: `render()`, `navigate()` e `sections` existentes; navegação `.section-nav a`.
- Produces: hash `#entenda`, seção `#education-section`, bibliografia `#education-references`, ambas estáticas em `index.html`. `render()` mostra a bibliografia em Entenda ou Fontes e preserva o restante da navegação.

- [ ] **Step 1: Escrever testes de conteúdo e navegador.** Em `test_education.py`, analisar o HTML com `html.parser` e verificar cinco grupos de conteúdo (`risco-prevencao`, `tipos-biomarcadores`, `diagnostico-estadiamento`, `principios-tratamento`, `perguntas-revisao`), links DOI `10.3390/jcm14031025` e `10.1097/MD.0000000000032899`, referências oficiais MS/SBOC, data/versão SBOC, indicação histórica da DDT, aviso educativo e ausência dos identificadores do caso nos arquivos públicos alterados. Em `browser_check.py`, incluir `entenda` nas verificações desktop/mobile; testar carregamento direto e reload, visibilidade exclusiva da seção, filtros ocultos, bibliografia nas duas abas, retorno aos valores GBD selecionados, e abertura de `details` com Enter.
- [ ] **Step 2: Confirmar falha antes da implementação.** Rodar `python -m unittest discover -s tests -v` e `python tests/browser_check.py` contra servidor local na worktree. Esperado: testes novos falham por seção/rota ausente, sem substituir os testes existentes.
- [ ] **Step 3: Escrever conteúdo estático original.** Usar os cinco grupos definidos e respostas expansíveis nativas. Explicar risco sem estigmatizar, prevenção e diferença entre rastreamento e investigação de sintomas; histologia/biomarcadores sem algoritmo prescritivo; confirmação tecidual e conceitos TNM/edição; modalidades terapêuticas e decisão multidisciplinar; perguntas conceituais, sem copiar o caso. Referências por tópico levam à bibliografia compartilhada, sem hashes desconhecidos que ativem `navigate()` indevidamente: usar links de fragmento com o hash de rota `#entenda` ou referências textuais e links oficiais diretos.
- [ ] **Step 4: Integrar rota e apresentação.** Inserir aba antes de Fontes; adicionar `sections.entenda`, controlar `education-section`/`education-references`, ocultar GBD/SIM/filtros onde não se aplicam. Reutilizar `.card.prose` e grids atuais; ajustar grade somente se necessário. Sem tocar em `data/`, `data-model.mjs` ou transformações de dados.
- [ ] **Step 5: Validar e revisar o texto.** Rodar testes Python, `node --test tests/model.test.mjs` e navegador. Conferir atribuições por tópico com os textos extraídos temporários já lidos e v8 oficial; revisar explicitamente limites, privacidade, ausência de doses e contraste/overflow com respostas abertas.
- [ ] **Step 6: Commit.** `git add index.html app.js styles.css tests/browser_check.py tests/test_education.py` (omitir arquivos não alterados); `git commit -m "feat: add sourced educational lung cancer section"`.

### Task 2: Cache, evidências e publicação

**Files:**
- Modify: `index.html` — URLs versionadas dos assets.
- Modify: `tests/cache_check.py` — regressão de visitante da versão anterior.
- Modify: `docs/validation.md` — fontes, comandos e limites reais.

**Interfaces:**
- Consumes: rota `#entenda` e bibliografia da Task 1.
- Produces: CSS e script principal versionados `?v=education-1`; release pública verificada em `https://fanaiagabi.github.io/epidemio-lab/?v=education-1#entenda`.

- [ ] **Step 1: Acrescentar regressão de cache.** Preservar teste claro→escuro. Acrescentar cenário que serve HTML/CSS/JS de `3e7de3a` com `max-age=600`, mantém o cache real, muda para HTML atual e exige a nova rota/aba, dark mode e nenhuma exceção JS após nova visita. Servir módulos e dados locais com os caminhos usuais, sem desabilitar cache.
- [ ] **Step 2: Confirmar falha.** `python tests/cache_check.py` deve demonstrar a incompatibilidade com `app.js` antigo antes do versionamento.
- [ ] **Step 3: Versionar assets e verificar.** Alterar links CSS e script principal em `index.html` para `?v=education-1`; não versionar módulos não modificados. Rodar `python tests/cache_check.py`, `python -m unittest discover -s tests -v`, `node --test tests/model.test.mjs`, `python tests/browser_check.py`, `git diff --check`; todos devem passar. Inspecionar screenshot da aba educativa em desktop/mobile, com respostas abertas.
- [ ] **Step 4: Registrar evidências.** Atualizar `docs/validation.md` com resultados de fato, data/versão dos quatro referenciais públicos, temas do material de ensino sem narrativa privada, limites de revisão científica e browsers não testados. Registrar que a comparação textual v7/v8 corrigiu M1b, sem reproduzir tabela no site.
- [ ] **Step 5: Revisão e commit.** Revisar diff completo, confirmar `git diff 2bbaaaa -- data data-model.mjs` vazio e que nenhum PDF/material privado entrou no índice. Registrar aprovação editorial ainda não especializada. Commit `fix: version educational release assets and record checks`.
- [ ] **Step 6: Publicar e conferir.** Push da branch isolada para `origin/main` conforme autorização existente, sem sobrescrever atualizações remotas divergentes. Confirmar o novo HTML no Pages e executar `python tests/browser_check.py "https://fanaiagabi.github.io/epidemio-lab/?v=education-1"`; só então relatar publicação. Se a publicação falhar ou continuar pendente, informar estado real sem declarar conclusão.

## Resultado da execução — 15/11/2026

- [x] Task 1, steps 1–6: testes RED→GREEN, conteúdo/rota/bibliografia implementados e commit `3e461dd`.
- [x] Task 2, steps 1–5: cache RED→GREEN, assets versionados, suítes aprovadas, evidências e revisão independente sem crítico/importante, commits `e41fb4c` e `02d8d60`.
- [x] Task 2, step 6: push normal para main, build `built` em `02d8d60` e teste Chromium completo no endereço público aprovado. Notas de decisões, menores adiados e limitações em `docs/validation.md`.

## Self-review original

Todos os itens de aceite têm entrega e teste nas Tasks 1/2; os cinco riscos acima estão cobertos. Bibliografia estática evita duplicação e mantém conteúdo editorial fora das strings longas de renderização. Não há nova API, infraestrutura ou dependência. Execução aguarda escolha do método pela usuária.
