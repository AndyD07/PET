const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({});
const source = new URL('../dist/store.js', `file://${__filename.replaceAll('\\', '/')}`);
if (fs.existsSync(source)) vm.runInContext(fs.readFileSync(source, 'utf8'), context);
test('adding twice merges quantities and calculates exact cents', () => {
  assert.ok(context.PetStore, 'shopping cart model must exist');
  const s = context.PetStore;
  const cart = s.change(s.change({}, 'chicken', 1), 'chicken', 1);
  assert.equal(cart.chicken, 2);
  assert.equal(s.total(cart), 5800);
  assert.equal(s.count(cart), 2);
});
test('decrement removes final item; unknown items cannot enter cart', () => {
  assert.ok(context.PetStore);
  const s = context.PetStore;
  const cart = s.change({chicken: 1}, 'chicken', -1);
  assert.equal(s.count(cart), 0);
  assert.equal(s.count(s.change(cart, 'unknown', 1)), 0);
});
test('restoring cart rejects malformed and stale stored data', () => {
  assert.ok(context.PetStore);
  const s = context.PetStore;
  assert.equal(s.count(s.restore('broken json')), 0);
  assert.equal(s.count(s.restore('{"chicken":2,"salmon":-1,"unknown":4}')), 2);
  assert.equal(s.count(s.restore('null')), 0);
  assert.equal(s.count(s.restore('{"chicken":1.5}')), 0);
  assert.equal(s.total(s.restore('{"chicken":2,"salmon":1}')), 9700);
});
