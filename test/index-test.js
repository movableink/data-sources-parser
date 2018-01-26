import HTML from '../src/index';

const { module, test } = QUnit;

module('index', () => {
  test('it is correct', (assert) => {
    assert.equal(HTML, '<html></html>');
  });
});
