import HTMLNormalizer from '../../src/-lib/html-normalizer';

const { module, test, only } = QUnit;

module('HTMLNormalizer', () => {
  module('#document', () => {
    test('it is an instance of a Document', (assert) => {
      const normalizer = new HTMLNormalizer('<html></html>');
      assert.ok(normalizer.document instanceof Document, 'document is generated when invoked');
    });

    test('it is never recomputed', (assert) => {
      const normalizer = new HTMLNormalizer('<html></html>');
      assert.equal(normalizer.document, normalizer.document, 'document is generated when invoked');
    });
  });

  module('#baseURL', () => {
    function baseify(baseURL, extra = '') {
      return `
        <html>
          <head>
            <base href="${baseURL}" />
            ${extra}
          </head>
        </html>
      `;
    }

    module('no <base> tag', () => {
      test('it is the provided URL', (assert) => {
        const url = 'https://www.movableink.com/';
        const normalizer = new HTMLNormalizer('<html></html>', url);
        assert.equal(normalizer.baseURL, url);
      });

      test('it is the provided URL (with a path)', (assert) => {
        const url = 'https://www.movableink.com/some/path';
        const normalizer = new HTMLNormalizer('<html></html>', url);
        assert.equal(normalizer.baseURL, url);
      });

      test('it is the provided URL without query params', (assert) => {
        const url = 'https://www.movableink.com/';
        const normalizer = new HTMLNormalizer('<html></html>', `${url}?my=query&params=rock`);
        assert.equal(normalizer.baseURL, url);
      });

      test('it is the provided URL without fragments', (assert) => {
        const url = 'https://www.movableink.com/';
        const normalizer = new HTMLNormalizer('<html></html>', `${url}#some-segment`);
        assert.equal(normalizer.baseURL, url);
      });
    });

    module('relative <base> tag', () => {
      test('it is unchanged if base and url is root', (assert) => {
        const url = 'https://www.movableink.com/';
        const normalizer = new HTMLNormalizer(baseify('/'), url);
        assert.equal(normalizer.baseURL, url);
      });

      test('it adds to path if base has root path', (assert) => {
        const url = 'https://www.movableink.com/';
        const normalizer = new HTMLNormalizer(baseify('/some/path/'), url);
        assert.equal(normalizer.baseURL, `${url}some/path/`);
      });

      test('it replaces path if base has root path', (assert) => {
        const url = 'https://www.movableink.com/';
        const normalizer = new HTMLNormalizer(baseify('/some/path/'), `${url}other/path/added`);
        assert.equal(normalizer.baseURL, `${url}some/path/`);
      });

      test('it adds to path if base has relative path', (assert) => {
        const url = 'https://www.movableink.com/';
        const normalizer = new HTMLNormalizer(baseify('some/path/'), url);
        assert.equal(normalizer.baseURL, `${url}some/path/`);
      });

      test('it adds path if base has relative path', (assert) => {
        const url = 'https://www.movableink.com/other/path/added/';
        const normalizer = new HTMLNormalizer(baseify('some/path/'), url);
        assert.equal(normalizer.baseURL, `${url}some/path/`);
      });

      test('it excludes extra path parts that do not end in a slash', (assert) => {
        const url = 'https://www.movableink.com/other/';
        const normalizer = new HTMLNormalizer(baseify('some/path'), `${url}part`);
        assert.equal(normalizer.baseURL, `${url}some/`);
      });

      test('it uses only the first <base> tag (per the spec)', (assert) => {
        const url = 'https://www.movableink.com/';
        const normalizer = new HTMLNormalizer(
          baseify('some/path/', '<base href="some/other/path" />'),
          url
        );
        assert.equal(normalizer.baseURL, `${url}some/path/`);
      });
    });

    module('absolute <base> tag', () => {
      test('it will use the fully qualified absolute URL (adding trailing slash)', (assert) => {
        const url = 'https://www.movableink.com';
        const normalizer = new HTMLNormalizer(baseify(url), 'http://www.something-else.com');

        assert.equal(normalizer.baseURL, `${url}/`);
      });

      test('it excludes the last part if not ending in a slash', (assert) => {
        const url = 'https://www.movableink.com/other/';
        const normalizer = new HTMLNormalizer(baseify(`${url}path`), 'http://www.something-else.com');

        assert.equal(normalizer.baseURL, url);
      });

      test('it will add the `http` protocol from source url if it is not specified', (assert) => {
        const url = '//www.movableink.com/';
        const normalizer = new HTMLNormalizer(baseify(url), 'http://www.something-else.com');

        assert.equal(normalizer.baseURL, `http:${url}`);
      });

      test('it will add the `https` protocol from source url if it is not specified', (assert) => {
        const url = '//www.movableink.com/';
        const normalizer = new HTMLNormalizer(baseify(url), 'https://www.something-else.com');

        assert.equal(normalizer.baseURL, `https:${url}`);
      });

      test('it will remove query parameters from the base url', (assert) => {
        const url = 'https://www.movableink.com';
        const normalizer = new HTMLNormalizer(baseify(`${url}?test=true`), 'http://www.something-else.com');

        assert.equal(normalizer.baseURL, `${url}/`);
      });

      test('it will remove the fragment from the base url', (assert) => {
        const url = 'https://www.movableink.com';
        const normalizer = new HTMLNormalizer(baseify(`${url}#test=true`), 'http://www.something-else.com');

        assert.equal(normalizer.baseURL, `${url}/`);
      });
    });
  });
});
