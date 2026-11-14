import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const path = new URL('../data-model.mjs', import.meta.url);
const data = JSON.parse(await readFile(new URL('../data/epidemiologia.json', import.meta.url)));
let model;
try { model = await import(path); } catch (error) {
  if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
}

test('seleciona exatamente a linha de cada combinação GBD', () => {
  assert.ok(model, 'Modelo ainda não implementado');
  for (const row of data.gbd) {
    assert.equal(model.selectGbd(data.gbd, {measure:row.Medida, location:row.Localidade, sex:row.Sexo, metric:row['Métrica']}), row);
  }
  assert.equal(model.selectGbd(data.gbd, {measure:'inexistente'}), null);
});

test('zero real é zero; ausência ou valor inválido não vira zero', () => {
  assert.ok(model, 'Modelo ainda não implementado');
  assert.equal(model.valueForYear({'2023':0}, 2023), 0);
  for (const value of [null, undefined, '', NaN, Infinity]) {
    assert.equal(model.valueForYear({'2023':value}, 2023), null);
  }
  assert.equal(model.valueForYear(null, 2023), null);
});

test('variação usa base não arredondada e não divide por zero', () => {
  assert.ok(model, 'Modelo ainda não implementado');
  assert.equal(model.variation(100,125),25);
  assert.equal(model.variation(100,0),-100);
  assert.equal(model.variation(0,125),null);
  assert.equal(model.variation(null,125),null);
});

test('SIM mantém dimensões e bases independentes e revela divergência', () => {
  assert.ok(model, 'Modelo ainda não implementado');
  const home=model.simDistribution(data.sim,'Sexo','Residencia');
  const event=model.simDistribution(data.sim,'Sexo','Ocorrencia');
  assert.equal(home.total,2771);
  assert.deepEqual(home.items.map(x=>x.value),[1648,1123]);
  assert.deepEqual(event.items.map(x=>x.value),[1598,1080]);
  assert.equal(home.difference,0);
  const incomplete = model.simDistribution(data.sim.filter(r=>r.Sexo!=='Fem'),'Sexo','Residencia');
  assert.equal(incomplete.difference,1123);
});

test('seleção literal do arquivo de incidência Brasil 2023 permanece exata', () => {
  assert.ok(model, 'Modelo ainda não implementado');
  const row=model.selectGbd(data.gbd,{measure:'Incidência',location:'Brasil',sex:'Ambos',metric:'Número'});
  assert.equal(model.valueForYear(row,2023),39345.1049);
});
