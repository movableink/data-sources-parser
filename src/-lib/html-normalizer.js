export default class HTMLNormalizer {
  constructor(htmlText, resourceURL = window.location.href) {
    this._document = this._createDocument(htmlText);
    this._url = this._generateBaseURL(resourceURL);
  }

  get document() {
    return this._document;
  }

  get baseURL() {
    return this._url.toString();
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
      if (/^\/\//.test(docBase)) {
        docBase = `${url.protocol}${docBase}`;
      }

      url = new URL(docBase);
      docBase = '';

      // If the `base` happens to not end in a trailing slash, then we
      // remove the last segment of that path to compute the "base"
      url.pathname = pathDir(url.pathname);
    }

    const { searchParams, pathname } = url;

    // Remove the Query Params
    for (let key of searchParams.keys()) {
      searchParams.delete(key);
    }

    // Remove the fragment, if present
    url.hash = '';

    // Add the newly resolved path.
    if (docBase) {
      url.pathname = reconcilePaths(pathname, docBase);
    }

    return url;
  }

  // absolutizePath
  // extractMapping
  // toString
}


function isAbsoluteURL(url) {
  return /^(https?|\/\/)/.test(url);
}

function reconcilePaths(startPath, updatePath) {
  // If the "update path" starts with a slash, it's a replace operation
  if (/^\//.test(updatePath)) {
    return updatePath;
  } else {
    return [...pathDir(startPath).split('/'), ...pathDir(updatePath).split('/')]
      .filter(p => !!p)
      .join('/') + '/';
  }
}

function pathDir(path) {
  return path.replace(/[^\/]+$/, '');
}
