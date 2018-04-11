const assert = require('chai').assert;

const Dante = require('../src/index.js');

describe('Dante.type', () => {

  it('Dante.UrlParser', () => {
    const { String } = Dante;
    const url = 'http://www.baidu.com/order/?name=222&medicenId={0}&s=222';
    const parser = new Dante.UrlParser(url);
    parser.paras.redirectUrl = 'http://www.link.com?name=2';
    const url2 = parser.toString();
    assert.equal(true, url2.indexOf("{0}") > 0);
  });

});