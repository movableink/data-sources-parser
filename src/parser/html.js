export default function parseHTML(rawHTML) {
  if (rawHTML.match(/\<[a-zA-z]+[^>]*>/)) {
    return rawHTML.trim();
  } else {
    throw new Error('Passed string does not contain HTML');
  }
}

