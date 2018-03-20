const assert = require('chai').assert;

const Dante = require('../src/index.js');

describe('Dante.Promise', () => {

  var errorHandle = console.error;



  //--------------Dante.Promise.then--------------------->
  it('Dante.Promise.then', () => {
    var returnData = 'data';
    var promise = new Dante.Promise(function (resolve, reject) {
      resolve(returnData);
    });
    promise.then(function (data) {
      assert.equal(data, returnData);
    })
    Promise.resolve('hello').then(function (data) {
      assert.equal('hello', data);
    })
  });

  //--------------Dante.Promise.catch--------------------->
  it('Dante.Promise.catch', () => {
    var promise = new Dante.Promise(function (resolve, reject) {
      resolve('');
    });
    console.error = function () {

    }
    promise.then(function () {
      throw new Error('error');
    })
    promise.catch(function (err) {
      assert.equal('error', err.message);
    })
    Promise.reject('hello').catch(function (data) {
      assert.equal('hello', data);
      setTimeout(function(){
        console.error = errorHandle;
      },100)
    })
  });

  //--------------Dante.Promise.all--------------------->
  it('Dante.Promise.all', () => {
    var Promise = Dante.Promise;
    var promise = new Promise(function (resolve) { resolve('a'); })
    var promise2 = new Promise(function (resolve) { resolve('b') });
    Promise.all([promise, promise2]).then(function (data) {
      assert.equal(data.join(','), 'a,b');
    })
  });

})