# Ferramentas de estudo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar glossário e calculadora com blocos e linha do tempo.
**Architecture:** Dois diálogos estáticos em index.html com inicialização independente do JSON. Novo módulo study-tools.mjs contém cálculo puro e inicializador DOM; app.js só inicializa. CSS reutiliza tokens existentes.
**Tech Stack:** HTML, CSS, JavaScript nativos; Node test e Python/Playwright disponíveis.
**Spec:** docs/superpowers/specs/2026-11-15-ferramentas-estudo-design.md

## Global Constraints
- Sem alteração de data/ ou data-model.mjs; nenhuma dependência de produção.
- Fórmula: (cigarros/dia ÷ 20) × anos; sem interpretação de dano/risco individual.
- Campos não persistidos/transmitidos, animações reduzíveis, dark mode, teclado e 375 px.

## Review Focus
- Vazio/negativo/não finito não pode manter resultado antigo ou virar zero.
- Frações, zero e agrupamento >40 blocos preservam a quantidade e mostram escala.
- Linha do tempo representa o mesmo total e duração, inclusive duração zero.
- Foco, pesquisa sem acentos, fechar/reabrir, reduced-motion e falha JSON não quebram ferramentas.
- Visitantes com assets education-1 em cache recebem botões funcionais e estilo novo.

### Task 1: Ferramentas completas
**Files:** criar study-tools.mjs, tests/study.test.mjs e tests/study_check.py; editar index.html, app.js, styles.css e tests/cache_check.py.
**Interfaces:** calculateExposure(cigarettes:number, years:number) -> number|null (null para valores não finitos/negativos); initStudyTools() -> void; IDs smoking-dialog, glossary-dialog. Nenhuma mudança no modelo epidemiológico.
- [ ] Escrever testes Node: 10×20=10, 20×10=10, 5×2.5=.625, zero, negativos, NaN/Infinity/overflow.
- [ ] Escrever teste Chromium: abrir por botão/teclado, exemplo, quantidade/escala/fração dos blocos, gráfico/tabela, vazio/negativo, reset, glossário por termo/acento e sem resultado, foco/Escape, celular e reduced-motion, ferramentas disponíveis sem JSON. Ver falhas antes do produto.
- [ ] Implementar dois diálogos e módulo mínimo, estilos e assets study-1. Referências e limites editoriais no HTML.
- [ ] Acrescentar regressão de cache education-1→study-1 (mesmo cache real do teste existente), botões funcionam após atualização. Ver falha sem novo versionamento e passar com versão nova.
- [ ] Rodar unittest, node --test tests/*.test.mjs, browser_check, study_check e cache_check; inspecionar screenshots desktop/mobile. Commit.

### Task 2: Revisão e publicação
**Files:** docs/validation.md e este plano.
**Interfaces:** entrega pública ?v=study-1, sem backend.
- [ ] Uma revisão independente do diff completo, corrigir achados importantes.
- [ ] Conferir integridade dos dados e git diff --check, registrar evidências reais.
- [ ] Commit e push fast-forward para main, verificar build Pages e rodar testes público existentes + study_check; documentar resultado e limites.

## Progresso
- Baseline ed4789f, worktree limpa/isolada; Python 5/5, Node 5/5 e browser_check PASS.
- Usuária optou por aplicação direta; não haverá pausa para aprovação de plano.
