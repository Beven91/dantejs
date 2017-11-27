const assert = require('chai').assert;
const Dante = require('../src/index.js');

describe('Dante.string', () => {

    /*-----------type.ensure------------------------*/
    it("Dante.String.ensure", () => {
        assert.equal("10", Dante.String.ensure(10, "hello"));
        assert.equal("", Dante.String.ensure('', "hello"));
        assert.equal("hello", Dante.String.ensure(null, "hello"));
        assert.equal("hello", Dante.String.ensure(undefined, "hello"));
    });

    /*-----------type.format------------------------*/
    it("Dante.String.format", () => {
        assert.equal("name:ok,age:12", Dante.String.format('name:{0},age:{1}', "ok", "12"));
        assert.equal("name:12,age:ok", Dante.String.format('name:{1},age:{0}', "ok", "12"));
        assert.equal("name:ok,age:12,age:12", Dante.String.format('name:{0},age:{1},age:{1}', "ok", "12"));
        assert.equal("name:ok,age:12,sex:{2}", Dante.String.format('name:{0},age:{1},sex:{2}', "ok", "12"));
    });

    /*-----------type.format2------------------------*/
    it("Dante.String.format2", () => {
        assert.equal("name:ok,age:12", Dante.String.format2('name:{0},age:{1}', ["ok", "12"]));
        assert.equal("name:12,age:ok", Dante.String.format2('name:{1},age:{0}', ["ok", "12"]));
        assert.equal("name:ok,age:12,age:12", Dante.String.format2('name:{0},age:{1},age:{1}', ["ok", "12"]));
        assert.equal("name:ok,age:12,sex:{2}", Dante.String.format2('name:{0},age:{1},sex:{2}', ["ok", "12"]));
    });

    /*-----------type.startsWith------------------------*/
    it("Dante.String.startsWith", () => {
        assert.equal(true, Dante.String.startsWith('hello beven', "hello"));
        assert.equal(true, Dante.String.startsWith('hello beven', "hell"));
        assert.equal(false, Dante.String.startsWith(' hello beven', "hell"));
        assert.equal(false, Dante.String.startsWith('Hello beven', "hell"));
        assert.equal(true, Dante.String.startsWith('Hello beven', "hell", true));
        assert.equal(true, Dante.String.startsWith('   Hello beven', "   hell", true));
        assert.equal(true, Dante.String.startsWith('   Hello beven', " ", true));
    });


    /*-----------type.endsWith------------------------*/
    it("Dante.String.endsWith", () => {
        assert.equal(true, Dante.String.endsWith('hello beven', "beven"));
        assert.equal(true, Dante.String.endsWith('hello beven', "even"));
        assert.equal(false, Dante.String.endsWith(' hello beven ', "beven"));
        assert.equal(false, Dante.String.endsWith('Hello Beven', "beven"));
        assert.equal(true, Dante.String.endsWith('Hello Beven', "beven", true));
        assert.equal(true, Dante.String.endsWith('   Hello beven ', "beven ", true));
        assert.equal(true, Dante.String.endsWith('   Hello beven ', " ", true));
    });

    /*-----------type.trim------------------------*/
    it("Dante.String.trim", () => {
        assert.equal('beven', Dante.String.trim(' beven '));
        assert.equal('beven', Dante.String.trim('  beven'));
    });

    /*-----------type.trimLeft------------------------*/
    it("Dante.String.trimLeft", () => {
        assert.equal('beven ', Dante.String.trimLeft(' beven '));
        assert.equal('beven ', Dante.String.trimLeft('   beven '));
        assert.equal('abcbeven ', Dante.String.trimLeft('   beven ', '', 'abc'));
        assert.equal('bevenabc', Dante.String.trimLeft('abcbevenabc', 'abc'));
        assert.equal('Abcbevenabc', Dante.String.trimLeft('Abcbevenabc', 'abc'));
        assert.equal('bevenabc', Dante.String.trimLeft('Abcbevenabc', 'abc', true));
    });

    /*-----------type.trimRight------------------------*/
    it("Dante.String.trimRight", () => {
        assert.equal(' beven', Dante.String.trimRight(' beven '));
        assert.equal(' beven', Dante.String.trimRight(' beven     '));
        assert.equal('bevenabc', Dante.String.trimRight('beven    ', '', 'abc'));
        assert.equal('beven', Dante.String.trimRight('bevenabc', 'abc'));
        assert.equal('bevenAbc', Dante.String.trimRight('bevenAbc', 'abc'));
        assert.equal('beven', Dante.String.trimRight('bevenAbc', 'abc', true));
    });

    /*-----------type.isEmpty------------------------*/
    it("Dante.String.isEmpty", () => {
        assert.equal(false, Dante.String.isEmpty(''));
        assert.equal(true, Dante.String.isEmpty(null));
        assert.equal(true, Dante.String.isEmpty(undefined));
    });

    /*-----------type.isEmptyAny------------------------*/
    it("Dante.String.isEmptyAny", () => {
        assert.equal(true, Dante.String.isEmptyAny(null, 's', 'a', ''));
        assert.equal(false, Dante.String.isEmptyAny('', 's', 'a', ''));
        assert.equal(true, Dante.String.isEmptyAny(undefined, 's', 'a', ''));
    });

    /*-----------type.isEmptyEvery------------------------*/
    it("Dante.String.isEmptyEvery", () => {
        assert.equal(false, Dante.String.isEmptyEvery(null, 's', 'a', ''));
        assert.equal(false, Dante.String.isEmptyEvery('', 's', 'a', ''));
        assert.equal(true, Dante.String.isEmptyEvery(undefined, null));
    });

    /*-----------type.isBlank------------------------*/
    it("Dante.String.isBlank", () => {
        assert.equal(false, Dante.String.isBlank('s'));
        assert.equal(true, Dante.String.isBlank(''));
        assert.equal(true, Dante.String.isBlank('   '));
        assert.equal(true, Dante.String.isBlank(null));
        assert.equal(true, Dante.String.isBlank(undefined));
    });

    /*-----------type.isBlankAny------------------------*/
    it("Dante.String.isBlankAny", () => {
        assert.equal(true, Dante.String.isBlankAny(null, 's', 'a', ''));
        assert.equal(true, Dante.String.isBlankAny('', 's', 'a', ''));
        assert.equal(true, Dante.String.isBlankAny(undefined, 's', 'a', ''));
        assert.equal(false, Dante.String.isBlankAny('ss', 's', 'a', '22'));
    });

    /*-----------type.isBlankEvery------------------------*/
    it("Dante.String.isBlankEvery", () => {
        assert.equal(false, Dante.String.isBlankEvery(null, 's', 'a', ''));
        assert.equal(false, Dante.String.isBlankEvery('', 's', 'a', ''));
        assert.equal(true, Dante.String.isBlankEvery(undefined, null, ''));
    });

    /*-----------type.emptyOf------------------------*/
    it("Dante.String.emptyOf", () => {
        assert.equal('12', Dante.String.emptyOf(null, '12'));
        assert.equal('12', Dante.String.emptyOf(undefined, '12'));
    });

    /*-----------type.blankOf------------------------*/
    it("Dante.String.blankOf", () => {
        assert.equal('12', Dante.String.blankOf(null, '12'));
        assert.equal('12', Dante.String.blankOf(undefined, '12'));
        assert.equal('12', Dante.String.blankOf('', '12'));
        assert.equal('12', Dante.String.blankOf('   ', '12'));
    });

    /*-----------type.equals------------------------*/
    it("Dante.String.equals", () => {
        assert.equal(false, Dante.String.equals('12', 12));
        assert.equal(false, Dante.String.equals(null, ''));
        assert.equal(false, Dante.String.equals('', ' '));
        assert.equal(true, Dante.String.equals('12', '12'));
        assert.equal(true, Dante.String.equals('', ''));
    });

    /*-----------type.repeat------------------------*/
    it("Dante.String.repeat", () => {
        assert.equal('1212', Dante.String.repeat('12', 2));
        assert.equal('121212', Dante.String.repeat('12', 3));
        assert.equal('12', Dante.String.repeat('12', 1));
        assert.equal(null, Dante.String.repeat('12', 0));
        assert.equal(null, Dante.String.repeat(null, 2));
        assert.equal(null, Dante.String.repeat(undefined, 2));
        assert.equal('', Dante.String.repeat('', 2));
        assert.equal('  ', Dante.String.repeat(' ', 2));
    });

    /*-----------type.pad------------------------*/
    it("Dante.String.pad", () => {
        assert.equal('12', Dante.String.pad('12', 0));
        assert.equal('12', Dante.String.pad('12', 1));
        assert.equal('12', Dante.String.pad('12', -1));
        assert.equal('12', Dante.String.pad('12', null));
        assert.equal('  12 ', Dante.String.pad('12', 5));
        assert.equal('  12  ', Dante.String.pad('12', 6));
        assert.equal('--12--', Dante.String.pad('12', 6, '-'));
        assert.equal('001200', Dante.String.pad('12', 6, '0'));
    });

    /*-----------type.padLeft------------------------*/
    it("Dante.String.padLeft", () => {
        assert.equal('12', Dante.String.padLeft('12', 0));
        assert.equal('12', Dante.String.padLeft('12', 1));
        assert.equal('12', Dante.String.padLeft('12', -1));
        assert.equal('12', Dante.String.padLeft('12', null));
        assert.equal('   12', Dante.String.padLeft('12', 5));
        assert.equal('    12', Dante.String.padLeft('12', 6));
        assert.equal('----12', Dante.String.padLeft('12', 6, '-'));
        assert.equal('000012', Dante.String.padLeft('12', 6, '0'));
    });

    /*-----------type.padRight------------------------*/
    it("Dante.String.padRight", () => {
        assert.equal('12', Dante.String.padRight('12', 0));
        assert.equal('12', Dante.String.padRight('12', 1));
        assert.equal('12', Dante.String.padRight('12', -1));
        assert.equal('12', Dante.String.padRight('12', null));
        assert.equal('12   ', Dante.String.padRight('12', 5));
        assert.equal('12    ', Dante.String.padRight('12', 6));
        assert.equal('12----', Dante.String.padRight('12', 6, '-'));
        assert.equal('120000', Dante.String.padRight('12', 6, '0'));
    });

    /*-----------type.replace------------------------*/
    it("Dante.String.replace", () => {
        assert.equal('bevenhello', Dante.String.replace('aabevenaahello', 'aa'));
        assert.equal('bbbevenbbhello', Dante.String.replace('aabevenaahello', 'aa', 'bb'));
        assert.equal('bevenahello', Dante.String.replace('aaaabevenaaaaahello', 'aa'));
    });

    /*-----------type.ensureStartsWith------------------------*/
    it("Dante.String.ensureStartsWith", () => {
        assert.equal('hi beven', Dante.String.ensureStartsWith('beven', 'hi '));
        assert.equal('hi beven', Dante.String.ensureStartsWith('hi beven', 'hi '));
    });

    /*-----------type.ensureEndsWith------------------------*/
    it("Dante.String.ensureEndsWith", () => {
        assert.equal('beven hello', Dante.String.ensureEndsWith('beven', ' hello'));
        assert.equal('beven hello', Dante.String.ensureEndsWith('beven hello', ' hello'));
    });

});