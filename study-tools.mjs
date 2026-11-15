export function calculateExposure(cigarettes, years) {
  if (![cigarettes, years].every(value => typeof value === 'number' && Number.isFinite(value) && value >= 0)) return null;
  const total = cigarettes / 20 * years;
  return Number.isFinite(total) ? total : null;
}

const format = value => value.toLocaleString('pt-BR', {
  maximumSignificantDigits:6,
  notation:value >= 1e6 || (value > 0 && value < .001) ? 'scientific' : 'standard',
});
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');

export function initStudyTools() {
  const $ = id => document.getElementById(id);
  const smoking = $('smoking-dialog');
  const glossary = $('glossary-dialog');
  const form = $('smoking-form');
  const cigarettes = $('cigarettes');
  const years = $('smoking-years');
  let returnFocus;

  document.querySelectorAll('[data-open-study]').forEach(button => {
    button.addEventListener('click', () => {
      returnFocus = button;
      const dialog = $(button.dataset.openStudy);
      dialog.showModal();
      dialog.scrollTop = 0;
    });
  });
  [smoking, glossary].forEach(dialog => {
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        dialog.close();
      }
    });
    dialog.addEventListener('close', () => {
      if (!smoking.open && !glossary.open) returnFocus?.focus();
    });
  });
  document.querySelectorAll('[data-close-study]').forEach(button => {
    button.addEventListener('click', () => button.closest('dialog').close());
  });

  function filterGlossary() {
    const query = normalize($('glossary-search').value.trim());
    let count = 0;
    $('glossary-list').querySelectorAll(':scope > div').forEach(entry => {
      entry.hidden = !normalize(entry.textContent).includes(query);
      if (!entry.hidden) count++;
    });
    $('glossary-empty').hidden = count !== 0;
    $('glossary-count').textContent = `${count} ${count === 1 ? 'termo encontrado' : 'termos encontrados'}`;
  }
  $('glossary-search').addEventListener('input', filterGlossary);
  $('study-glossary-link').addEventListener('click', () => {
    smoking.close();
    $('glossary-search').value = 'maços-ano';
    filterGlossary();
    glossary.showModal();
    glossary.scrollTop = 0;
  });

  function renderExposure() {
    const total = calculateExposure(cigarettes.valueAsNumber, years.valueAsNumber);
    const valid = form.checkValidity() && total !== null;
    $('smoking-error').hidden = valid;
    $('smoking-output').hidden = !valid;
    [cigarettes, years].forEach(input => input.setAttribute('aria-invalid', String(!input.validity.valid)));
    if (!valid) return;

    const duration = years.valueAsNumber;
    $('smoking-result').textContent = `${format(total)} maços-ano`;
    $('smoking-formula').textContent = `(${format(cigarettes.valueAsNumber)} ÷ 20) × ${format(duration)} = ${format(total)} maços-ano`;
    let unit = total > 40 ? 10 ** Math.ceil(Math.log10(total / 40)) : 1;
    if (total / unit > 40) unit *= 10;
    const count = Math.min(40, Math.ceil(total / unit));
    $('block-scale').textContent = `Cada bloco representa ${format(unit)} ${unit === 1 ? 'maço-ano' : 'maços-ano'}. Escala visual ajustável, não uma faixa de risco.`;
    $('exposure-blocks').innerHTML = Array.from({length:count}, (_, i) => {
      const width = Math.max(0, Math.min(1, total / unit - i)) * 100;
      return `<span class="exposure-block"><span class="block-fill" style="width:${width}%;animation-delay:${i * 12}ms"></span></span>`;
    }).join('');
    $('blocks-zero').hidden = total !== 0;

    const endX = duration > 0 ? 410 : 40;
    const endY = total > 0 ? 28 : 175;
    $('timeline-chart').innerHTML = `<line class="timeline-axis" x1="40" y1="175" x2="410" y2="175"/><line class="timeline-axis" x1="40" y1="175" x2="40" y2="28"/><path class="timeline-curve" pathLength="1" d="M40 175 L${endX} ${endY}"/><circle class="timeline-point" cx="${endX}" cy="${endY}" r="5"/><text x="20" y="180">0</text>`;
    $('timeline-end').textContent = `${format(duration)} anos → ${format(total)} maços-ano`;
    $('timeline-table').querySelector('tbody').innerHTML = Array.from({length:duration > 0 ? 5 : 1}, (_, i) => {
      const fraction = i / 4;
      return `<tr><th scope="row">${format(duration * fraction)} anos</th><td>${format(total * fraction)} maços-ano</td></tr>`;
    }).join('');
  }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', renderExposure);
  $('restore-smoking').addEventListener('click', () => {
    cigarettes.value = '10';
    years.value = '20';
    renderExposure();
  });
  $('no-motion').addEventListener('change', event => {
    $('smoking-output').classList.toggle('no-motion', event.target.checked);
  });
  filterGlossary();
  renderExposure();
}
