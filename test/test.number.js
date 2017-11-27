const assert = require('chai').assert;

const Dante = require('../src/index.js');

describe('Dante.number', () => {

    //--------------Dante.Number.ensureDecimal--------------------->
    it('Dante.Number.ensureDecimal', () => {

        assert.equal(0, Dante.Number.ensureDecimal('0'));
        assert.equal(0, Dante.Number.ensureDecimal(''));
        assert.equal(0, Dante.Number.ensureDecimal(null));
        assert.equal(0, Dante.Number.ensureDecimal(undefined));
        assert.equal(1, Dante.Number.ensureDecimal('1'));
    });

    //--------------Dante.Number.mul--------------------->
    it('Dante.Number.mul', () => {
        assert.equal(6, Dante.Number.mul(1, 2, 3));
    });

});