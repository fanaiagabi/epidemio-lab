# EPIDEMIO LAB

Painel educativo estático sobre câncer de traqueia, brônquios e pulmão. GitHub Pages configurado em https://fanaiagabi.github.io/epidemio-lab/ . Sem backend, analytics ou dependências de produção.

## Executar

```sh
python -m http.server 8080
```

Abra http://localhost:8080 . Não abra `index.html` via `file://`: módulos JavaScript e carregamento do JSON exigem HTTP.

## Validação da primeira versão

Testes Python (4), Node (5) e verificação funcional em Chromium aprovados localmente e no site público, inclusive em subdiretório e em viewport de 375 px. A revisão independente não encontrou bloqueios. Publicação conferida com HTTP 200 e build Pages `built`. [Evidências, decisões e limitações](docs/validation.md). Capturas de validação ficam apenas em `test-results/` (não publicado).

`python tests/browser_check.py URL` executa a checagem funcional contra um servidor local ou site publicado; exige Playwright no ambiente de teste, não no site. Não houve auditoria WCAG numérica, teste com leitor de tela real ou outros navegadores.

Melhorias menores não bloqueantes: ampliar rótulos auxiliares de 8–9 px no celular; testar ausência numérica diretamente na interface (hoje os arquivos são completos e o caso é coberto no modelo); distinguir barra de valor ausente de barra de zero se o contrato dos dados mudar; tornar `unit()` tolerante a medidas novas, se elas forem adicionadas.

## Dados e testes

```sh
python scripts/prepare_data.py
python -m unittest discover -s tests -v
node --test tests/model.test.mjs
```

Quatro CSVs agregados fornecidos pela responsável pelo projeto estão em `data/source/`. Três atribuídos ao GBD (2013–2023) e um ao SIM/TABNET (Mato Grosso, agregado rotulado 2016–2026). `data/epidemiologia.json` preserva campos e valores sem arredondamento. Exibição arredondada não altera as fontes.

Não houve autenticação independente da origem oficial ou revisão científica. A unidade por 100 mil habitantes foi indicada nas três capturas GBD recebidas; as capturas não são republicadas. Não assumir que taxas sejam ajustadas por idade. Intervalos de incerteza existem somente para 2023. Percentuais GBD não são exibidos por falta de documentação do denominador. Arquivos chamados `modelo_mortalidade_cancer_inca_*`, capturas, ZIP e arquivos de links vazios foram excluídos da publicação.

Distribuições SIM são marginais: não cruzar categorias nem somar dimensões. Recorte de 5 a 74 anos, C34; não comparar diretamente com o GBD de todas as idades e C33–C34. O período informado inclui 2026 e pode estar incompleto. Revalidar fonte, recorte e fechamento antes de uso acadêmico. Nenhuma recomendação clínica ou conclusão causal é fornecida.

## Publicar

GitHub → Settings → Pages → Deploy from a branch → `main` → `/ (root)`. `.nojekyll` desativa Jekyll. A publicação só está confirmada quando a URL responde HTTP 200 e os dados carregam. Código público não deve conter credenciais ou dados pessoais.

## Referência visual

Organização inspirada no [FARMACO LAB, de André D. Bacchi](https://andrebacchi.github.io/farmaco-lab/), sem afiliação. Código, identidade e textos desta interface foram criados para este projeto; não são cópia dos arquivos da referência. Não há logotipos institucionais nem endosso das instituições citadas. Nenhuma licença de redistribuição das bases é inferida: conferir condições dos provedores antes de reutilizá-las.
