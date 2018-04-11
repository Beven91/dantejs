const assert = require('chai').assert;

const Dante = require('../src/index.js');

describe('Dante.type', () => {

  it('Dante.UrlParser', () => {
    const { String } = Dante;
    const url = 'http://www.baidu.com/order/#?name=222&medicenId={0}&s=222';
    const isAbsolute = /^(https|http|\/\/)/.test(url);
    const baseUri = String.ensureEndsWith('www.baidu.com', '/');
    const pathname = String.trimLeft(url, '/');
    const externalUrl = isAbsolute ? url : baseUri + pathname;
    const segments = externalUrl.split('#');
    const hashUrl = segments[1];
    const parser = new Dante.UrlParser(hashUrl || externalUrl);
    //附加渠道信息
    Object.assign(parser.paras, {});
    const targetUrl = parser.toString();
    console.log(targetUrl);
    const url2 = hashUrl ? segments[0] + '#' + targetUrl : targetUrl;
    console.log(url2);
    //assert.equal(true, array instanceof Array);
});

});