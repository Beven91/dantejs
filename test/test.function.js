const assert = require('chai').assert;

const Dante = require('../src/index.js');

describe('Dante.fn', () => {

    let obj = {
        name: 'beven'
    }

    let count = 0;

    function doSomething(other, other2) {
        assert.equal('beven', this.name);
        assert.equal(other, 'hello');
        assert.equal(other2, '2')
    }

    function onceDoSomething(other, other2) {
        count = count + 1;
        assert.equal('beven', this.name);
        assert.equal(other, 'hello');
        assert.equal(other2, '2');
        assert.equal(1, count);
    }

    //--------------Dante.Fn.call--------------------->
    it('Dante.Fn.call', () => {
        Dante.Fn.call(obj, doSomething, 'hello', '2');
    });

    //--------------Dante.Fn.apply--------------------->
    it('Dante.Fn.apply', () => {
        Dante.Fn.apply(obj, doSomething, ['hello', '2']);
    });

    //--------------Dante.Fn.bind--------------------->
    it('Dante.Fn.bind', () => {
        let fn = Dante.Fn.bind(obj, doSomething);
        fn('hello', '2');
    });

    //--------------Dante.Fn.once--------------------->
    it('Dante.Fn.once', () => {
        let fn = Dante.Fn.once(obj, doSomething);
        fn('hello', '2');
        fn('hello', '2');
    });
});