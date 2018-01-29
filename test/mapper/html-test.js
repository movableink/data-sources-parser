import mapHTML from '../../src/mapper/html';

const { module, test, only } = QUnit;

module('mapper - html', () => {
  module('text', () => {
    test('it handles text mappings', function(assert) {
      const html = `
        <header><h1 class='welcome'>Hello there.</h1></header>
        <p class='message'>Here's some text for you.</p>
      `;

      const mappings = [
        { originKey: 'header .welcome', key: 'Welcome', type: 'text' },
        { originKey: '.message', key: 'Message', type: 'text' }
      ];

      const output = mapHTML(html, mappings);

      assert.equal(typeof output, 'object', 'it outputs an object');
      assert.deepEqual(
        output,
        { 'Welcome': 'Hello there.', 'Message': "Here's some text for you." },
        'it maps the text values into their corresponding keys on the output object'
      );
    });

    test('it returns a trimmed string', function(assert) {
      const html = `<h1 class='msg'>           Hey now          </h1>`;

      const mappings = [
        { originKey: '.msg', key: 'Message', type: 'text' },
      ];

      const output = mapHTML(html, mappings);

      assert.equal(output['Message'], 'Hey now', 'it trims the text it returns');
    });

    test('it returns the innerText of an element', function(assert) {
      const html = `
        <body>
          <div class='mid-level-element'>
            <p>
              <span><strong>Strong like bull.</strong></span>
            </p>
          </div>
        </body>
      `;

      const mappings = [
        { originKey: '.mid-level-element', key: 'Message', type: 'text' },
      ];

      const output = mapHTML(html, mappings);

      assert.equal(
        output['Message'],
        'Strong like bull.',
        'it does not return HTML tags contained inside the Element'
      );
    });
  });

  module('image', () => {
    test('it returns the src of an img tag', function(assert) {
      const html = `
        <header>
          <a href='/'>
            <img class='cool-img' src='cool-dog.jpg'>
          </a>
        </div>
      `;

      const mappings = [
        { originKey: 'header .cool-img', key: 'Image', type: 'image' },
      ];

      const output = mapHTML(html, mappings);

      assert.equal(
        output['Image'],
        'cool-dog.jpg',
        'It pulls the `src` value off of an <img> tag'
      );
    });

    test('it accepts alternate attributes to pull off of img tags', function(assert) {
      const html = `
        <header>
          <a href='/'>
            <img class='cool-img' src='bad-dog.jpg' data-async-src='cool-dog.jpg' data-other-src='not-as-cool-dog.jpg'>
          </a>
        </div>
      `;

      const mappings = [
        { originKey: 'header .cool-img', key: 'Image', type: 'image', extractAttribute: 'data-async-src' },
      ];

      const output = mapHTML(html, mappings);

      assert.equal(
        output['Image'],
        'cool-dog.jpg',
        'Given an `extractAttribute` key in a mapping, it will pull attributes besides `src` off an IMG'
      );
    });
  });

  module('link', () => {
    test('it returns the href of an a tag', function(assert) {
      const html = `
        <header>
          <a class='free-stuff-link' href='www.free-stuff.com'>
            Click here!
            <img class='cool-img' src='cool-dog.jpg'>
          </a>
        </div>
      `;

      const mappings = [
        { originKey: 'header .free-stuff-link', key: 'Link', type: 'link' },
      ];

      const output = mapHTML(html, mappings);

      assert.equal(
        output['Link'],
        'www.free-stuff.com',
        'It pulls the `src` value off of an <img> tag'
      );
    });
  });

  test('duplicate elements', function(assert) {
    const html = `
      <div class='common-div'>I am the best</div>
      <div class='common-div'>I am pretty bad</div>
      <div class='common-div'>I am downright awful</div>
      <img class='common-img' src='good.jpg'>
      <img class='common-img' src='okay.jpg'>
      <img class='common-img' src='bad.jpg'>
      <a class='common-link' href='good.com'></a>
      <a class='common-link' href='okay.com'></a>
      <a class='common-link' href='bad.com'></a>
    `;

    const mappings = [
      { originKey: '.common-div', key: 'Message', type: 'text' },
      { originKey: '.common-img', key: 'Image', type: 'image' },
      { originKey: '.common-link', key: 'Link', type: 'link' },
    ];

    const output = mapHTML(html, mappings);

    assert.equal(
      output['Message'],
      'I am the best',
      'if a selector matches multiple Elements, it pulls the value from the first Element'
    );

    assert.equal(output['Image'], 'good.jpg');
    assert.equal(output['Link'], 'good.com');
  });

  test('invalid response', function(assert) {
    const html = 'This HTML contains zero tags, and is therefore considered invalid';

    try {
      mapHTML(html, []);
    } catch (e) {
      assert.ok(e.message, 'Data Source HTML response was invalid');
    }
  });

});
