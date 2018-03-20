const assert = require('chai').assert;

const Dante = require('../src/index.js');

describe('Dante.EventEmitter', () => {

  //--------------Dante.EventEmitter.on--------------------->
  it('Dante.EventEmitter.on', () => {
    var num = 1;
    var emitter = new Dante.EventEmitter();
    emitter.on('a', function () {
      num = num + 1;
    })
    emitter.on('a', function () {
      num = num + 1;
    })
    emitter.on('b', function () {
      num = num + 1;
    })
    emitter.emit('a');
    assert.equal(3, num);
  });

  //--------------Dante.EventEmitter.off--------------------->
  it('Dante.EventEmitter.on', () => {
    var value = '';
    var emitter = new Dante.EventEmitter();
    emitter.on('a', function () {
      value += 'a'
    })
    emitter.on('a', function () {
      value += 'a2';
      emitter.off('a', three);
    })
    emitter.on('a', three)
    function three() {
      value += 'three';
    }
    emitter.emit('a');
    assert.equal('aa2', value);
  });

  //--------------Dante.EventEmitter.destory--------------------->
  it('Dante.EventEmitter.destory', () => {
    var value = '';
    var emitter = new Dante.EventEmitter();
    emitter.on('a', function () {
      value += 'a'
    })
    emitter.on('a', function () {
      value += 'a2';
      emitter.destroy();
    })
    emitter.on('a', function three() {
      value += 'three';
    });
    emitter.on('a', function three() {
      value += 'three';
    });
    emitter.emit('a');
    assert.equal('aa2', value);
  });

})