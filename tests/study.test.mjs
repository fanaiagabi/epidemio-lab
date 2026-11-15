import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateExposure} from '../study-tools.mjs';

test('carga usa 20 cigarros por maço e mantém frações e zero', () => {
  for (const [cigarettes, years, expected] of [[10,20,10], [20,10,10], [5,2.5,.625], [0,20,0], [20,0,0], [80,100,400]]) {
    assert.equal(calculateExposure(cigarettes, years), expected);
  }
});

test('entrada negativa, não numérica ou resultado não finito não vira carga válida', () => {
  for (const [cigarettes, years] of [[-1,20], [10,-2], [NaN,20], [20,Infinity], [Infinity,0], [Number.MAX_VALUE,Number.MAX_VALUE], ['',20], [null,20]]) {
    assert.equal(calculateExposure(cigarettes, years), null);
  }
});
