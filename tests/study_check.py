"""Ferramentas reais em Chromium; também aceita URL pública como argumento."""
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
from browser_check import check_dark_theme

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8080/'
ROOT = Path(__file__).resolve().parents[1]


def check():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width':1440, 'height':1000})
        errors, leaks = [], []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(BASE)
        page.locator('[data-kpi="Incidência"]').wait_for()
        page.on('request', lambda request: leaks.append(request.url))
        opener = page.get_by_role('button', name='Carga tabágica', exact=True)
        opener.focus()
        page.keyboard.press('Enter')
        dialog = page.locator('#smoking-dialog')
        expect(dialog).to_be_visible()
        expect(dialog.get_by_role('button', name='Fechar calculadora')).to_be_in_viewport()
        expect(dialog.get_by_role('heading', name='Carga tabágica', exact=True)).to_be_in_viewport()
        expect(page.locator('#smoking-result')).to_have_text('10 maços-ano')
        assert page.locator('#exposure-blocks .exposure-block').count() == 10
        expect(page.locator('#block-scale')).to_contain_text('1 maço-ano')
        expect(page.locator('#timeline-table tbody tr').last).to_have_text('20 anos10 maços-ano')
        assert page.locator('#timeline-chart path').get_attribute('d') == 'M40 175 L410 28'
        check_dark_theme(page)
        cigarettes, years = page.locator('#cigarettes'), page.locator('#smoking-years')
        cigarettes.fill('5')
        years.fill('2.5')
        expect(page.locator('#smoking-result')).to_have_text('0,625 maços-ano')
        assert page.locator('#exposure-blocks .exposure-block').count() == 1
        assert page.locator('#exposure-blocks .block-fill').first.evaluate('(el)=>el.style.width') == '62.5%'
        expect(page.locator('#timeline-table tbody tr').last).to_have_text('2,5 anos0,625 maços-ano')
        cigarettes.fill('80')
        years.fill('100')
        expect(page.locator('#smoking-result')).to_have_text('400 maços-ano')
        assert page.locator('#exposure-blocks .exposure-block').count() == 40
        expect(page.locator('#block-scale')).to_contain_text('10 maços-ano')
        years.fill('101')
        expect(page.locator('#smoking-result')).to_have_text('404 maços-ano')
        assert page.locator('#exposure-blocks .exposure-block').count() <= 40
        expect(page.locator('#block-scale')).to_contain_text('100 maços-ano')
        cigarettes.fill('0')
        expect(page.locator('#smoking-result')).to_have_text('0 maços-ano')
        assert page.locator('#exposure-blocks .exposure-block').count() == 0
        cigarettes.fill('20')
        years.fill('0')
        expect(page.locator('#smoking-result')).to_have_text('0 maços-ano')
        assert 'NaN' not in page.locator('#timeline-chart').inner_html()
        assert page.locator('#timeline-chart path').get_attribute('d') == 'M40 175 L40 175'
        for invalid in ['', '-1']:
            years.fill(invalid)
            expect(page.locator('#smoking-output')).to_be_hidden()
            expect(page.locator('#smoking-error')).to_be_visible()
        years.fill('1e308')
        cigarettes.fill('1e308')
        expect(page.locator('#smoking-output')).to_be_hidden()
        dialog.get_by_role('button', name='Restaurar exemplo').click()
        expect(page.locator('#smoking-result')).to_have_text('10 maços-ano')
        page.locator('#no-motion').check()
        assert page.locator('#smoking-output .block-fill').first.evaluate('(el)=>getComputedStyle(el).animationName') == 'none'
        page.locator('#no-motion').uncheck()
        page.emulate_media(reduced_motion='reduce')
        years.fill('21')
        assert page.locator('#smoking-output .block-fill').first.evaluate('(el)=>getComputedStyle(el).animationName') == 'none'
        assert page.locator('#timeline-chart path').evaluate('(el)=>getComputedStyle(el).animationName') == 'none'
        page.keyboard.press('Escape')
        expect(opener).to_be_focused()
        page.get_by_role('button', name='Glossário', exact=True).click()
        search = page.get_by_role('searchbox', name='Buscar termo')
        expect(search).to_be_focused()
        search.fill('incidencia')
        expect(page.locator('#glossary-list > div:visible dt')).to_have_text('Incidência')
        search.fill('MAÇOS-ANO')
        expect(page.locator('#glossary-list > div:visible dt')).to_have_text('Maços-ano')
        search.fill('zzzzzz')
        expect(page.locator('#glossary-empty')).to_be_visible()
        search.fill('')
        assert page.locator('#glossary-list > div:visible').count() >= 15
        page.locator('#glossary-dialog').get_by_role('button', name='Fechar glossário').click()
        opener.click()
        dialog.get_by_role('button', name='Restaurar exemplo').click()
        page.locator('#study-glossary-link').click()
        expect(dialog).to_be_hidden()
        expect(page.locator('#glossary-dialog')).to_be_visible()
        expect(search).to_have_value('maços-ano')
        page.keyboard.press('Escape')
        expect(opener).to_be_focused()
        assert not leaks, f'Campos não devem disparar rede: {leaks}'
        assert page.evaluate('localStorage.length === 0 && sessionStorage.length === 0')
        results = ROOT / 'test-results'
        results.mkdir(exist_ok=True)
        for width in [1440, 720, 375]:
            page.set_viewport_size({'width':width, 'height':900})
            opener.click()
            assert dialog.evaluate('(el)=>el.scrollTop') == 0, 'Reabrir deve mostrar o título'
            dialog.locator('details').evaluate_all('(els)=>els.forEach(el=>el.open=true)')
            assert dialog.evaluate('(el)=>el.scrollWidth <= el.clientWidth'), width
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), width
            if width != 720:
                dialog.screenshot(path=str(results / f'smoking-{width}.png'))
            dialog.get_by_role('button', name='Fechar calculadora').click()
            page.get_by_role('button', name='Glossário', exact=True).click()
            search.fill('')
            glossary = page.locator('#glossary-dialog')
            assert glossary.evaluate('(el)=>el.scrollWidth <= el.clientWidth'), width
            check_dark_theme(page)
            if width != 720:
                glossary.screenshot(path=str(results / f'glossary-{width}.png'))
            page.keyboard.press('Escape')
        failed = browser.new_page()
        failed.route('**/data/epidemiologia.json', lambda route: route.abort())
        failed.goto(BASE)
        failed.get_by_role('button', name='Tentar novamente').wait_for()
        failed.get_by_role('button', name='Carga tabágica', exact=True).click()
        expect(failed.locator('#smoking-result')).to_have_text('10 maços-ano')
        assert not errors, errors
        browser.close()
    print(json.dumps({'result':'PASS', 'checks':['cálculo','frações e agrupamento','linha do tempo e tabela','zero e inválidos','glossário e busca','foco e teclado','reduced motion','375px','sem persistência ou envio de campos','independente do JSON','sem erros JS']}, ensure_ascii=False))


if __name__ == '__main__':
    check()
