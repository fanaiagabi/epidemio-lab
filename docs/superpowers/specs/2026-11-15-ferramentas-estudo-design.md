# Glossário e carga tabágica

Autorização: usuária pediu aplicar direto no site e incluir as duas representações propostas. Execução inline, sem nova rodada de aprovação.

- Dois botões com ícone e texto, disponíveis independentemente da carga epidemiológica: Glossário e Carga tabágica. Diálogos nativos, fechamento por botão/Escape, foco de teclado, dark mode e layout móvel.
- Glossário pesquisável de termos já presentes no painel e nas leituras; definições originais concisas, fontes existentes citadas, sem arquivo adicional necessário.
- Calculadora: cigarros/dia e anos de consumo, valores não negativos (inclusive frações), assumindo 20 cigarros/maço e consumo médio constante. Iniciar com exemplo explicitamente rotulado 10 cigarros/dia × 20 anos = 10 maços-ano. Campos vazios/inválidos não são zero: ocultar resultados anteriores e mostrar orientação.
- Mostrar ambas as representações simultaneamente: blocos com preenchimento fracionado e escala explícita (máximo 40 blocos, agrupados em potências de 10 conforme necessário), e gráfico de exposição acumulada versus anos decorridos, acompanhado de tabela. Zero mantém resultado zero sem dividir por zero.
- Animações breves, não contínuas, desativadas por prefers-reduced-motion e checkbox local. Resultado textual independente das animações. Não persistir nem transmitir campos.
- Aviso: maços-ano mede exposição, não dano nem probabilidade individual de câncer. Sem semáforo clínico, máximo seguro, pulmões escurecendo ou critério automático de rastreamento. Não converter cigarros eletrônicos/charutos; mudanças de consumo e pausas exigem avaliação por períodos (fora deste escopo).
- Alternativas: blocos isolados (mais compacto) e linha do tempo isolada (ênfase em duração) foram propostas; usuária escolheu ambas. Dois cartões compartilham os mesmos campos e resultado, sem duas calculadoras independentes.
- Preservar todos dados, filtros, gráficos e conteúdo anterior; manter HTML/CSS/JS nativos, sem novas dependências de produção. Versionar assets como study-1, testar atualização com cache e publicar no Pages autorizado.

Decisões de implementação do agente: acesso por diálogos, pesquisa simples sem distinção de acentos, tabela em cinco pontos da duração para consumo constante, sem faixas clínicas. Termos e fórmula não substituem revisão especializada.
