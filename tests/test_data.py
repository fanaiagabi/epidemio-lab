import csv
import importlib.util
import math
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class DataTests(unittest.TestCase):
    def build(self, directory=None):
        script = ROOT / 'scripts' / 'prepare_data.py'
        self.assertTrue(script.exists(), 'Conversor de dados ainda não implementado')
        spec = importlib.util.spec_from_file_location('prepare_data', script)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module.build_data(directory or ROOT / 'data' / 'source')

    def test_selected_sources_only(self):
        data = self.build()
        self.assertEqual(len(data['metadata']['files']), 4)
        self.assertEqual(len(data['gbd']), 108)
        self.assertEqual(len(data['sim']), 26)
        self.assertFalse(any('modelo' in f for f in data['metadata']['files']))

    def test_complete_gbd_dimensions(self):
        rows = self.build()['gbd']
        keys = {(r['Medida'], r['Localidade'], r['Sexo'], r['Métrica']) for r in rows}
        self.assertEqual(len(keys), 108)
        self.assertEqual({r['Localidade'] for r in rows}, {'Global', 'Brasil', 'Centro-Oeste', 'Mato Grosso'})
        for row in rows:
            for year in range(2013, 2024):
                self.assertTrue(math.isfinite(row[str(year)]))
                self.assertGreaterEqual(row[str(year)], 0)
            self.assertLessEqual(row['UI_95_Inf_2023'], row['2023'])
            self.assertLessEqual(row['2023'], row['UI_95_Sup_2023'])

    def test_sim_marginal_totals(self):
        rows = self.build()['sim']
        self.assertEqual(rows[0]['Obitos_Residencia'], 2771)
        self.assertEqual(rows[0]['Obitos_Ocorrencia'], 2678)
        for dimension in ['Sexo', 'Cor_Raca', 'Escolaridade', 'Faixa_Etaria']:
            for field, total in [('Obitos_Residencia', 2771), ('Obitos_Ocorrencia', 2678)]:
                self.assertEqual(sum(r[field] for r in rows if r[dimension]), total)

    def test_conversion_preserves_every_numeric_value(self):
        data = self.build()
        for filename in data['metadata']['files']:
            with (ROOT / 'data' / 'source' / filename).open(encoding='utf-8-sig', newline='') as f:
                originals = list(csv.DictReader(f))
            converted = data['sim'] if filename.startswith('sim_') else [r for r in data['gbd'] if r['Medida'] == originals[0]['Medida']]
            self.assertEqual(len(originals), len(converted))
            for original, result in zip(originals, converted):
                self.assertEqual(set(original), set(result))
                for field, value in result.items():
                    self.assertEqual(float(original[field]) if isinstance(value, (int, float)) else original[field], value)


if __name__ == '__main__':
    unittest.main()
