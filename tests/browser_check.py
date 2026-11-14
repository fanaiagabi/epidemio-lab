"""Verificação funcional em Chromium. Requer Playwright apenas no ambiente de teste."""
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8080/'
ROOT = Path(__file__).resolve().parents[1]


def check_dark_theme(page):
    colors = page.evaluate('''() => {
        const rgb = color => color.match(/[\\d.]+/g).slice(0,3).map(Number);
        const luminance = color => rgb(color).map(v => {
            v /= 255;
            return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
        }).reduce((sum,v,i) => sum + v * [.2126,.7152,.0722][i], 0);
        return [...document.querySelectorAll('body,.card,.filters,select,.notice,.data-table th,.data-table td,.section-nav a,.download,.hero-art')]
            .filter(el => el.getClientRects().length)
            .map(el => {
                const style = getComputedStyle(el);
                const background = style.backgroundColor;
                return {element:el.tagName + '.' + el.className, background,
                    brightness:luminance(background),
                    contrast:(luminance(style.color) + .05) / (luminance(background) + .05)};
            });
    }''')
    assert page.evaluate("getComputedStyle(document.documentElement).colorScheme") == 'dark'
    for color in colors:
        if color['background'] == 'rgba(0, 0, 0, 0)':
            continue
        assert color['brightness'] < .18, color
        assert color['contrast'] >= 4.5, color


def check():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 1000})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(BASE)
        page.locator('[data-kpi="Incidência"] .kpi-value').wait_for()
        page.emulate_media(color_scheme='light')
        check_dark_theme(page)
        assert page.locator('[data-kpi="Incidência"] .kpi-value').inner_text() == '39.345'
        assert page.locator('[data-kpi="Prevalência"] .kpi-value').inner_text() == '41.325'
        assert page.locator('[data-kpi="Óbitos"] .kpi-value').inner_text() == '39.305'
        page.get_by_role('combobox', name='Localidade GBD', exact=True).select_option('Mato Grosso')
        assert page.locator('[data-kpi="Incidência"] .kpi-value').inner_text() == '548'
        page.get_by_role('combobox', name='Sexo GBD', exact=True).select_option('Feminino')
        page.get_by_role('combobox', name='Ano GBD', exact=True).select_option('2013')
        assert 'não disponível' in page.locator('[data-kpi="Incidência"]').inner_text().lower()
        page.get_by_role('button', name='Restaurar filtros').click()
        assert page.get_by_role('combobox', name='Localidade GBD', exact=True).input_value() == 'Brasil'
        for section in ['incidencia', 'prevalencia', 'mortalidade', 'fontes', 'visao-geral']:
            page.locator(f'nav a[href="#{section}"]').click()
            expect(page.locator(f'nav a[href="#{section}"]')).to_have_attribute('aria-current', 'page')
            page.locator('details').evaluate_all('(elements) => elements.forEach(el => el.open = true)')
            check_dark_theme(page)
        page.goto(BASE + '#inexistente')
        expect(page.locator('nav a[href="#visao-geral"]')).to_have_attribute('aria-current', 'page')
        page.locator('nav a[href="#mortalidade"]').click()
        expect(page.locator('#sim-total')).to_have_text('2.771')
        page.get_by_role('combobox', name='Contagem SIM', exact=True).select_option('Ocorrencia')
        assert page.locator('#sim-total').inner_text() == '2.678'
        assert page.locator('#sim-section').get_by_text('1.598', exact=True).count() > 0
        for option in ['Número', 'Taxa']:
            page.get_by_role('combobox', name='Métrica GBD', exact=True).select_option(option)
            assert page.locator('#gbd-content svg').count() > 0
        page.get_by_role('button', name='Restaurar filtros').click()
        results = ROOT / 'test-results'
        results.mkdir(exist_ok=True)
        page.locator('nav a[href="#visao-geral"]').click()
        expect(page.locator('nav a[href="#visao-geral"]')).to_have_attribute('aria-current', 'page')
        page.screenshot(path=str(results / 'desktop.png'), full_page=True)
        page.set_viewport_size({'width':375, 'height':812})
        for section in ['visao-geral', 'incidencia', 'prevalencia', 'mortalidade', 'fontes']:
            page.locator(f'nav a[href="#{section}"]').click()
            expect(page.locator(f'nav a[href="#{section}"]')).to_have_attribute('aria-current', 'page')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Transbordamento em {section}'
            check_dark_theme(page)
        page.locator('nav a[href="#visao-geral"]').click()
        expect(page.locator('nav a[href="#visao-geral"]')).to_have_attribute('aria-current', 'page')
        page.screenshot(path=str(results / 'mobile.png'), full_page=True)
        page.locator('.skip').focus()
        page.keyboard.press('Tab')
        assert page.evaluate("document.activeElement.tagName === 'A'")
        assert not errors, errors
        failed = browser.new_page()
        failed.route('**/data/epidemiologia.json', lambda route: route.abort())
        failed.goto(BASE)
        failed.get_by_role('button', name='Tentar novamente').wait_for()
        assert failed.get_by_role('alert').is_visible()
        failed.unroute('**/data/epidemiologia.json')
        failed.get_by_role('button', name='Tentar novamente').click()
        failed.locator('[data-kpi="Incidência"]').wait_for()
        browser.close()
    print(json.dumps({'browser':'Chromium', 'result':'PASS', 'checks':['KPIs CSV','filtros','restaurar','cinco abas','hash inválido','SIM independente','taxas','375px sem overflow','teclado','erro de rede e recuperação','sem erros JS']}, ensure_ascii=False))


if __name__ == '__main__':
    check()
