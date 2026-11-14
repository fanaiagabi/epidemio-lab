export function selectGbd(rows, {measure, location, sex, metric}) {
  return rows.find(r => r.Medida === measure && r.Localidade === location && r.Sexo === sex && r['Métrica'] === metric) ?? null;
}

export function valueForYear(row, year) {
  const value = row?.[String(year)];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function variation(first, last) {
  return typeof first === 'number' && typeof last === 'number' && Number.isFinite(first) && Number.isFinite(last) && first > 0
    ? (last - first) / first * 100 : null;
}

export function simDistribution(rows, dimension, basis) {
  const field = `Obitos_${basis}`;
  const totalRow = rows.find(r => r.Regiao);
  const total = totalRow?.[field] ?? null;
  const items = rows.filter(r => r[dimension]).map(r => ({label:r[dimension], value:r[field]}));
  return {total, items, difference:total === null ? null : total - items.reduce((sum,r) => sum + r.value, 0)};
}
