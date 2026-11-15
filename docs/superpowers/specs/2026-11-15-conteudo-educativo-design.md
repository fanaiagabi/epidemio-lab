# Conteúdo educativo sobre câncer de pulmão

## Intenção e aprovação

Ampliar o EPIDEMIO LAB com uma síntese em português dos cinco documentos únicos recebidos, para conectar a exploração epidemiológica ao estudo da doença. A usuária escolheu a opção de conteúdo integrado. Este desenho curto aguarda aprovação antes de implementação e publicação.

## Abordagens

1. **Síntese educativa integrada (escolhida):** nova seção no painel, com referências por tópico. Torna a leitura útil sem obrigar a abrir todos os documentos; exige distinguir conceitos estáveis de recomendações datadas.
2. **Biblioteca de leituras:** referências e descrições, sem síntese. Menor alteração, mas não desenvolve o conteúdo pedido na página.

## Escopo

- Acrescentar a aba “Entenda o câncer de pulmão”, usando os cartões e componentes escuros já existentes, com leitura responsiva e navegação por teclado.
- Organizar o conteúdo em fatores de risco e prevenção; tipos histológicos e biomarcadores; diagnóstico e estadiamento; princípios de tratamento; perguntas de revisão com respostas expansíveis.
- Citar os artigos de 2023 e 2025 por DOI, a DDT pela página oficial do Ministério da Saúde e a SBOC pela página oficial e versão conferida. Informar datas e limites das fontes.
- Usar os temas do material de ensino para perguntas conceituais originais, sem reproduzir a narrativa clínica ou informações potencialmente identificáveis. Informar que o material didático recebido não foi republicado.
- Manter a bibliografia também acessível em “Fontes e cuidados”. Mostrar aviso de finalidade educativa, sem substituir avaliação profissional.

## Limites e segurança editorial

- Não alterar séries, números, filtros ou cálculos GBD/SIM. Filtros epidemiológicos não se aplicam à nova seção.
- Não hospedar PDFs originais, copiar figuras/tabelas ou publicar dados do caso clínico.
- Não acrescentar doses, prescrições, calculadora de estadiamento, recomendações individuais ou estimativas INCA ausentes nas fontes.
- Identificar a DDT como documento de 2014, não como orientação clínica atual nem como vigência jurídica comprovada.
- Referenciar a SBOC 2026 v8, cuja data impressa é 23/06/2026; não copiar a tabela de estadiamento da v7 recebida. Explicações gerais devem indicar que a edição TNM importa.
- Não tratar revisões narrativas como protocolo terapêutico. Decisões de tratamento dependem de estágio, histologia, biomarcadores, condição clínica e avaliação multidisciplinar.

## Implementação mínima proposta

Manter HTML/CSS/JavaScript estáticos, sem dependências ou backend novos. Alterar `index.html`, `app.js` e, somente se necessário, `styles.css`; atualizar os testes de navegação, conteúdo e cache e registrar evidências em `docs/validation.md`. Versionar os assets alterados para não reutilizar versões antigas em cache. Detalhes de redação e disposição dos cartões ficam a cargo da implementação dentro deste escopo.

## Aceite

- Nova aba acessível diretamente pelo endereço e pela navegação, com os cinco grupos de conteúdo e referências verificáveis.
- Nenhum detalhe potencialmente identificável do caso recebido é incluído nos arquivos públicos.
- Navegação, filtros e números anteriores permanecem corretos; a nova seção não exibe filtros GBD.
- Testes Python e Node existentes, teste de cache e verificação Chromium em desktop e 375 px passam, sem erros JavaScript nem transbordamento horizontal.
- Publicação só é declarada concluída após confirmar o conteúdo novo e o dark mode no endereço público. A entrega não equivale a revisão científica especializada ou auditoria integral de acessibilidade.
