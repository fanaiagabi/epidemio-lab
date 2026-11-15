"""Contratos HTML que ligam a navegação e as referências educativas."""
from html.parser import HTMLParser
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class PageLinks(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.ids = []
        self.links = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'a':
            self.links.append(attrs.get('href', ''))


class EducationTests(unittest.TestCase):
    def test_education_navigation_and_references_are_resolvable(self):
        page = PageLinks((ROOT / 'index.html').read_text(encoding='utf-8'))
        self.assertIn('#entenda', page.links)
        self.assertEqual(len(page.ids), len(set(page.ids)), 'IDs duplicados')
        for section in ['education-section', 'education-references', 'risco-prevencao',
                        'tipos-biomarcadores', 'diagnostico-estadiamento',
                        'principios-tratamento', 'perguntas-revisao']:
            self.assertIn(section, page.ids)
        for url in ['https://doi.org/10.3390/jcm14031025',
                    'https://doi.org/10.1097/MD.0000000000032899',
                    'https://www.gov.br/saude/pt-br/assuntos/pcdt/c/cancer-de-pulmao',
                    'https://sboc.org.br/diretrizes-publicas-categorias/2026']:
            self.assertIn(url, page.links)
        # Fragmentos desconhecidos ativam a rota de fallback do painel.
        routes = {'#main', '#visao-geral', '#incidencia', '#prevalencia',
                  '#mortalidade', '#fontes', '#entenda'}
        self.assertTrue(all(url in routes for url in page.links if url.startswith('#')))


if __name__ == '__main__':
    unittest.main()
