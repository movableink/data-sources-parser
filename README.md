# Movable Ink: Data Sources Parser

This library contains a library for parsing Data Sources responses in a consistent way.

## HTMLNormalizer

This class takes an HTML string and the URL of the HTML in its constructor. For example:

```js
import { HTMLNormalizer } from 'data-sources-parser';

new HTMLNormalizer(`
  <html>
   <body>
    <h1>Hello, world!</h1>
   </body>
  </html>
`, 'https://www.movableink.com');
```

### normalizer.document

This provides the created [document](https://developer.mozilla.org/en-US/docs/Web/API/Document) object.

```js
import { HTMLNormalizer } from 'data-sources-parser';
const { document } = new HTMLNormalizer('<html>...</html>', 'https://www.movableink.com');

const header = document.querySelector('h1');
```

### normalizer.baseURL

This provides the base URL of the page, taking into account any `<base>` tag and the provided URL:

```js
import { HTMLNormalizer } from 'data-sources-parser';
const { baseURL } = new HTMLNormalizer('<base href="/home/" />', 'https://www.movableink.com');

console.log(baseURL); // https://www.movableink.com/home/
```

### normalizers.absolutizePath

This takes a path (likely from an `href` or `src`) and converts it into its fully qualified URL, taking into account the URL and `<base>` tags of the page.

```js
import { HTMLNormalizer } from 'data-sources-parser';
const normalizer = new HTMLNormalizer('<base href="/home/" />', 'https://www.movableink.com');

const logoURL = normalizer.absolutizePath('images/logo.png');
console.log(logoURL); // https://www.movableink.com/home/images/logo.png
```
