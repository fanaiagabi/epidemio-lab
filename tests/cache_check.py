"""Reproduz visita ao tema claro seguida de atualização, mantendo o cache real."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import subprocess
import threading
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
GIT = Path.home() / 'AppData/Local/Programs/Git/cmd/git.exe'


def check():
    old_css = subprocess.check_output([str(GIT), 'show', '28a7131:styles.css'], cwd=ROOT)
    state = {'updated': False, 'styles_requested': []}

    class Handler(SimpleHTTPRequestHandler):
        def log_message(self, *_):
            pass

        def do_GET(self):
            path = urlsplit(self.path).path
            if path == '/':
                body = (ROOT / 'index.html').read_bytes() if state['updated'] else b'<link rel="stylesheet" href="./styles.css"><body>Previous light release</body>'
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Cache-Control', 'no-cache')
            elif path == '/styles.css':
                state['styles_requested'].append(self.path)
                body = (ROOT / 'styles.css').read_bytes() if state['updated'] else old_css
                self.send_response(200)
                self.send_header('Content-Type', 'text/css')
                self.send_header('Cache-Control', 'max-age=600')
            else:
                return super().do_GET()
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
    worker = threading.Thread(target=server.serve_forever, daemon=True)
    worker.start()
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            url = f'http://127.0.0.1:{server.server_port}/'
            page.goto(url)
            assert page.evaluate('getComputedStyle(document.documentElement).colorScheme') == 'light'
            state['updated'] = True
            page.goto(url + '?updated=1')
            page.locator('[data-kpi]').first.wait_for()
            scheme = page.evaluate('getComputedStyle(document.documentElement).colorScheme')
            assert scheme == 'dark', f'Tema antigo permaneceu em cache: {scheme}; CSS solicitado: {state["styles_requested"]}'
            browser.close()
        print('PASS: visitante anterior recebe tema escuro mesmo com CSS claro em cache por 600 segundos.')
    finally:
        server.shutdown()
        server.server_close()
        worker.join()


if __name__ == '__main__':
    check()
