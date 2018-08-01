import { XMLConverter } from '../../src/index';

const { module, test } = QUnit;

module('XMLConverter', () => {
  const testXmlStrings = {
    nullXml: '<xml><feed></feed></xml>',
    basicXml: '<xml><feed>feedContent</feed></xml>',
    attrXml: '<xml><feed one="1" two="2"></feed></xml>',
    attrTextXml: '<xml><feed one="1">text</feed></xml>',
    sameElementXml: '<xml><feed>feedOne</feed><feed>feedTwo</feed></xml>',
    multipleElementXml:
      '<xml><feed>feedOne</feed><feedTwo>feedTwo</feedTwo></xml>',
    attrElXml: '<xml><feed one="1"><el>elText</el></feed></xml>',
    cdataXml: '<xml><feed><![CDATA[characters with markup]]></feed></xml>',
    cdataElXml:
      '<xml><feed><el>elText</el><![CDATA[characters with markup]]></feed></xml>',
    mixedContentXml:
      '<xml><feed>my name is <name>Harry</name> and last name is <lname>James</lname></feed></xml>',
    attrMixedContentXml:
      '<xml><feed one="1">my name is <name>Harry</name> and last name is <lname>James</lname></feed></xml>'
  };

  const expectedJsonObjects = {
    nullXml: { xml: { feed: null } },
    basicXml: { xml: { feed: 'feedContent' } },
    attrXml: { xml: { feed: { _attributes: { one: '1', two: '2' } } } },
    attrTextXml: {
      xml: { feed: { _attributes: { one: '1' }, _text: 'text' } }
    },
    sameElementXml: { xml: { feed: ['feedOne', 'feedTwo'] } },
    multipleElementXml: { xml: { feed: 'feedOne', feedTwo: 'feedTwo' } },
    attrElXml: { xml: { feed: { _attributes: { one: '1' }, el: 'elText' } } },
    cdataXml: { xml: { feed: 'characters with markup' } },
    cdataElXml: {
      xml: { feed: { el: 'elText', _cdata: 'characters with markup' } }
    },
    mixedContentXml: {
      xml: {
        feed:
          'my name is <name>Harry</name> and last name is <lname>James</lname>'
      }
    },
    attrMixedContentXml: {
      xml: {
        feed: {
          _attributes: { one: '1' },
          _text:
            'my name is <name>Harry</name> and last name is <lname>James</lname>'
        }
      }
    }
  };

  Object.keys(testXmlStrings).forEach(key => {
    test(`${key} parses correctly`, assert => {
      const xml = testXmlStrings[key];
      const xmlToJsonObj = XMLConverter(xml);
      const expectedJsonObj = expectedJsonObjects[key];

      assert.deepEqual(xmlToJsonObj, expectedJsonObj);
    });
  });
});
