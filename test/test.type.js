const assert = require('chai').assert;

const Dante = require('../src/index.js');

describe('Dante.type', () => {

    //-----------Dante.Type.isType------------------------>
    it("Dante.Type.isType ", () => {
        assert.equal(true, Dante.Type.isType(10, "Number"));
        assert.equal(true, Dante.Type.isType('hello', "String"));
    });


    //-------------Dante.Type.nameType---------------------->
    it('Dante.Type.nameType', () => {
        let arrayValues = [10, "", new Date(), true];
        let arrayNames = ["Number", "String", "Date", "Boolean"];
        for (let i = 0, k = arrayValues.length; i < k; i++) {
            assert.equal(true, Dante.Type.nameType(arrayValues[i]) == arrayNames[i]);
        }
    });


    //----------------Dante.Type.isClass------------------->
    it('Dante.Type.isClass', () => {
        class Animate {}
        class Bird extends Animate {}
        class Cat extends Animate {}
        let bird = new Bird();
        assert.equal(true, Dante.Type.isClass(Bird, Animate));
        assert.equal(true, Dante.Type.isClass(bird, Animate));
        assert.equal(false, Dante.Type.isClass(Bird, Cat));
    });


    //--------------Dante.Type.isArray--------------------->
    it('Dante.Type.isArray', () => {
        assert.equal(true, Dante.Type.isArray([1, 2, 3, 4, 5]));
        assert.equal(false, Dante.Type.isArray(1));
    });


    //--------------Dante.Type.isFunction--------------------->
    it('Dante.Type.isFunction', () => {
        var anyHandler = () => {};
        assert.equal(true, Dante.Type.isFunction(anyHandler));
        assert.equal(false, Dante.Type.isFunction(1));
    });


    //--------------Dante.Type.isObject--------------------->
    it('Dante.Type.isObject', () => {
        var obj = {
            name: 'jack'
        };
        assert.equal(true, Dante.Type.isObject(obj));
        assert.equal(false, Dante.Type.isObject(1));
        assert.equal(false, Dante.Type.isObject(null));
    });


    //--------------Dante.Type.isBoolean--------------------->
    it('Dante.Type.isBoolean', () => {
        assert.equal(true, Dante.Type.isBoolean(true));
        assert.equal(false, Dante.Type.isBoolean('true'));
        assert.equal(false, Dante.Type.isBoolean(0));
    });


    //--------------Dante.Type.isDate--------------------->
    it('Dante.Type.isDate', () => {
        var date = new Date();
        assert.equal(true, Dante.Type.isDate(new Date()));
        assert.equal(false, Dante.Type.isDate(1));
    });


    //--------------Dante.Type.isString--------------------->
    it('Dante.Type.isString', () => {
        assert.equal(true, Dante.Type.isString('sssss'));
        assert.equal(false, Dante.Type.isString(11));
    });


    //--------------Dante.Type.isNumber--------------------->
    it('Dante.Type.isNumber', () => {
        assert.equal(true, Dante.Type.isNumber(10));
        assert.equal(false, Dante.Type.isNumber('10'));
    });

    //--------------Dante.Type.isNnObject--------------------->
    it('Dante.Type.isNnObject', () => {
        assert.equal(false, Dante.Type.isNnObject(null));
        assert.equal(true, Dante.Type.isNnObject({}));
        assert.equal(false, Dante.Type.isNnObject(1));
        assert.equal(false, Dante.Type.isNnObject('1'));
        assert.equal(false, Dante.Type.isNnObject(true));
        assert.equal(false, Dante.Type.isNnObject(new Date()));
        assert.equal(true, Dante.Type.isNnObject(new Object()));
    });

});