const TOKEN_REGEX = /\[([\w\s.-]+)\]/g;

export default function mapHTML(html, mappings) {
  const parser = new DOMParser();
  const document = parser.parseFromString(html, 'text/html');

  const mappedData = {};

  // DOMParser does not throw an actual Error when it fails to parse strings
  // into documents.
  if (document.documentElement.nodeName === "parsererror") {
    throw new Error("Data Source HTML response was invalid");
  }

  // We need at least one element in the response to perform field mapping
  if (!html.match(/<\w+[^(\/>)]*>/g)) {
    throw new Error("Data Source HTML response was invalid");
  }

  for (const map of mappings) {
    const selector = map.originKey;
    let element;

    try {
      element = document.querySelector(selector);
    } catch (e) {
      if (TOKEN_REGEX.test(selector)) {
        console.error(`The selector is invalid because the Tool Option was not set for ${selector}`);
      } else {
        console.error(`Attempting to use an invalid selector. ${selector}`);
      }
    }

    if (element) {
      if (map.type === 'text') {
        mappedData[map.key] = element.innerText.trim();
      } else if (map.type === 'image') {
        const extractAttribute = map.extractAttribute ? map.extractAttribute : 'src';
        mappedData[map.key] = element.getAttribute(extractAttribute).trim();
      } else if (map.type === 'link') {
        mappedData[map.key] = element.getAttribute('href').trim();
      }
    }
  }

  return mappedData;
}
