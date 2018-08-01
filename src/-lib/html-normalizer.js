export default class HTMLNormalizer {
  constructor(htmlText, resourceURL = window.location.href) {
    this._document = this._createDocument(htmlText);
    this._baseURL = this._generateBaseURL(resourceURL);
  }

  get document() {
    return this._document;
  }

  get baseURL() {
    return this._baseURL.toString();
  }

  absolutizePath(providedPath) {
    if (isAbsoluteURL(providedPath)) {
      return ensureProtocol(providedPath, this._baseURL.protocol);
    }

    const url = new URL(this.baseURL); // Copy the URL.
    const { pathname, hash, search } = extractPathParts(providedPath);

    url.pathname = reconcilePaths(url.pathname, pathname);
    url.search = search;
    url.hash = hash;

    return url.toString();
  }

  _getDocumentBaseURL() {
    const baseTag = this._document.querySelector('base');
    return baseTag && baseTag.getAttribute('href');
  }

  _createDocument(html) {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  _generateBaseURL(resourceURL) {
    let url = new URL(resourceURL);
    let docBase = this._getDocumentBaseURL();

    if (isAbsoluteURL(docBase)) {
      // if the base is missing a protocol, add it:
      docBase = ensureProtocol(docBase, url.protocol);

      url = new URL(docBase);
      docBase = '';

      // If the `base` happens to not end in a trailing slash, then we
      // remove the last segment of that path to compute the "base"
      url.pathname = pathDir(url.pathname);
    }

    // Remove the fragment and search, if present
    url.search = '';
    url.hash = '';

    // Add the newly resolved path.
    if (docBase) {
      url.pathname = pathDir(reconcilePaths(url.pathname, docBase));
    }

    return url;
  }
}

function ensureProtocol(url, protocol) {
  if (/^\/\//.test(url)) {
    return `${protocol}${url}`;
  }

  return url;
}

function isAbsoluteURL(url) {
  return /^(https?|\/\/)/.test(url);
}

function reconcilePaths(startPath, updatePath) {
  if (/^\//.test(updatePath)) {
    return updatePath;
  }

  const pathParts = [
    ...pathDir(startPath).split('/'),
    ...updatePath.split('/')
  ];

  // Ensure there aren't any "double slashes" in the middle of the path.
  return pathParts
    .filter(
      (part, index, arr) =>
        part !== '' || index === 0 || index === arr.length - 1
    )
    .join('/');
}

function pathDir(path) {
  return path.replace(/[^/]+$/, '');
}

function extractPathParts(path) {
  const isRootPath = path.charAt(0) === '/';
  const { search, hash, pathname: ogPath } = new URL(
    `https://www.movableink.com${isRootPath ? '' : '/'}${path}`
  );

  const pathname = isRootPath ? ogPath : ogPath.replace(/^\//, '');

  return { search, hash, pathname };
}
