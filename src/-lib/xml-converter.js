/* eslint no-underscore-dangle: 0 */
/* eslint no-param-reassign: 0 */
/* eslint no-plusplus: 0 */

function removeEmptyTextNodes(xml) {
  if (xml.childNodes.length) {
    for (let child = xml.firstChild; child; ) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        removeEmptyTextNodes(child);
        child = child.nextSibling;
      } else if (child.nodeValue.trim() === '') {
        const nextChild = child.nextSibling;
        xml.removeChild(child);
        child = nextChild;
      } else {
        child = child.nextSibling;
      }
    }
  }
}

function parseAttributes(node, output) {
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  if (!node.attributes.length) return;

  output._attributes = {};

  for (let i = 0; i < node.attributes.length; i++) {
    const attribute = node.attributes[i];
    output._attributes[attribute.nodeName] = attribute.nodeValue.trim() || '';
  }
}

function innerXML(node) {
  if (node.innerHTML) {
    return node.innerHTML;
  }
  let innerXMLStr = '';
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    innerXMLStr += new XMLSerializer().serializeToString(child);
  }
  return innerXMLStr;
}

function handleMapping(type, node, output) {
  if (!node.attributes.length) {
    return node.textContent.trim() || '';
  }
  output[type] = node.textContent.trim() || '';
  return output;
}

function parseNode(node) {
  let output = {};

  parseAttributes(node, output);

  if (node.childNodes.length) {
    let textChild = 0;
    let cdataChild = 0;
    let hasElementChild = false;

    for (let child = node.firstChild; child; child = child.nextSibling) {
      if (child.nodeType === Node.ELEMENT_NODE) hasElementChild = true;
      if (child.nodeType === Node.TEXT_NODE) textChild++;
      if (child.nodeType === Node.CDATA_SECTION_NODE) cdataChild++;
    }

    if (hasElementChild) {
      if (textChild < 2 && cdataChild < 2) {
        for (let child = node.firstChild; child; child = child.nextSibling) {
          switch (child.nodeType) {
            case Node.ELEMENT_NODE:
              // handles element arrays
              if (output[child.nodeName]) {
                if (output[child.nodeName] instanceof Array) {
                  output[child.nodeName].push(parseNode(child));
                } else {
                  output[child.nodeName] = [
                    output[child.nodeName],
                    parseNode(child)
                  ];
                }
              } else {
                output[child.nodeName] = parseNode(child);
              }
              break;
            case Node.TEXT_NODE:
              output._text = child.textContent.trim();
              break;
            case Node.CDATA_SECTION_NODE:
              output._cdata = child.textContent.trim();
              break;
            default:
              break;
          }
        }
      } else if (!node.attributes.length) {
        output = innerXML(node);
      } else {
        output._text = innerXML(node);
      }
    } else if (textChild) {
      output = handleMapping('_text', node, output);
    } else if (cdataChild) {
      output = handleMapping('_cdata', node, output);
    } else {
      throw new Error(`unhandled node type: ${node.nodeType}`);
    }
  } else if (!node.attributes.length) {
    output = null;
  }

  return output;
}

export default function xmlConverter(xml) {
  const xmlDoc =
    typeof xml === 'string'
      ? new DOMParser().parseFromString(xml, 'text/xml')
      : xml;

  removeEmptyTextNodes(xmlDoc);

  return parseNode(xmlDoc);
}
