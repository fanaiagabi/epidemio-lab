"""Converte exclusivamente os quatro CSVs aprovados, sem arredondar valores."""
import csv
import json
import math
from pathlib import Path

FILES = (
    'gbd_2023_cancer_pulmao_incidencia.csv',
    'gbd_2023_cancer_pulmao_prevalencia.csv',
    'gbd_2023_cancer_pulmao_obitos.csv',
    'sim_tabnet_c34_mt_2016_2026_consolidado-v2.csv',
)
GBD_NUMERIC = [str(y) for y in range(2013, 2024)] + [
    'UI_95_Inf_2023', 'UI_95_Sup_2023', 'Variacao_2013_2023_Pct',
]
SIM_NUMERIC = ['Obitos_Residencia', 'Percentual_Residencia', 'Obitos_Ocorrencia', 'Percentual_Ocorrencia']


def build_data(source_dir: Path) -> dict:
    data = {'gbd': [], 'sim': [], 'metadata': {
        'files': list(FILES), 'years': list(range(2013, 2024)),
        'provenance': 'Arquivos fornecidos pela responsável pelo projeto; origem oficial não autenticada.',
        'rate_unit': 'por 100 mil habitantes',
        'rate_unit_evidence': 'Unidade indicada nas três capturas GBD recebidas; conferir o recorte original antes de uso acadêmico.',
    }}
    for filename in FILES:
        is_sim = filename.startswith('sim_')
        with (source_dir / filename).open(encoding='utf-8-sig', newline='') as file:
            rows = list(csv.DictReader(file))
        if len(rows) != (26 if is_sim else 36):
            raise ValueError(f'Quantidade inesperada de linhas: {filename}')
        for row in rows:
            for field in SIM_NUMERIC if is_sim else GBD_NUMERIC:
                value = float(row[field])
                if not math.isfinite(value) or (value < 0 and field != 'Variacao_2013_2023_Pct'):
                    raise ValueError(f'Valor inválido: {filename}, {field}')
                row[field] = value
            if not is_sim and not row['UI_95_Inf_2023'] <= row['2023'] <= row['UI_95_Sup_2023']:
                raise ValueError(f'Intervalo inválido: {filename}')
            data['sim' if is_sim else 'gbd'].append(row)
    keys = [(r['Medida'], r['Localidade'], r['Sexo'], r['Métrica']) for r in data['gbd']]
    if len(set(keys)) != len(keys):
        raise ValueError('Chaves GBD duplicadas')
    return data


if __name__ == '__main__':
    root = Path(__file__).resolve().parents[1]
    result = build_data(root / 'data' / 'source')
    (root / 'data' / 'epidemiologia.json').write_text(
        json.dumps(result, ensure_ascii=False, indent=2, allow_nan=False) + '\n', encoding='utf-8',
    )
    print(f"JSON gerado: {len(result['gbd'])} linhas GBD e {len(result['sim'])} linhas SIM.")
