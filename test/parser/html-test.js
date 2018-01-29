import parseHTML from '../../src/parser/html';

const { module, test } = QUnit;

module('parse - html:', () => {
  test('it parses if its input contains tags', function(assert) {
    const input = '<h1>Hello this is <strong>HTML</strong>!</h1>';
    const output = parseHTML(input);

    assert.equal(input, output, 'it returns a string with valid HTML');
  });

  test('it trims its return value', function(assert) {
    const input = `        <h1>Hello! This is some text with extra whitespace</h1>


    `;
    const output = parseHTML(input);

    assert.equal(output, input.trim(), 'it trims its output');
  });

  test('it throws if input does not contain tags', function(assert) {
    const input = 'We consider this string as invalid HTML because there are no tags in it';
    assert.expect(2);

    try {
      parseHTML(input);
    } catch (error) {
      assert.ok(true, 'the parse function throws with invalid input');
      assert.equal(
        error.message,
        'Passed string does not contain HTML',
        'it throws an error if the input string does not contain any tags.'
      );
    }
  });
});


