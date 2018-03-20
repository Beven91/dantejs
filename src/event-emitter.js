/*******************************************************
 * 名称：链尚网主框架库文件：自定义事件容器
 * 日期：2015-07-16
 * 版本：0.0.1
 * 描述：事件容器，通过创建的事件容器实例进行自定义事件注册，以及在对应的时机触发指定事件
 * 
 *       例如： 
 *              var Dante = require('dantejs');
 *              var emitter = new Dante.EventEmitter();
 *              //添加事件处理队列函数
 *              emitter.on('change',function(newValue,oldValue){  console.log('something is changed');});
 *              //触发事件，并且实行事件的队列函数
 *              emitter.emit('change',newValue,oldValue);
 *******************************************************/
var Base = require('./base.js');
var Type = require('./type.js');
var Strings = require('./string.js');
var Arrays = require('./array.js');

/**
 * 名称：事件容器构造函数
 * 通过实例化当前容器 可以对其进行添加事件，以及执行指定类型的事件队列
 * 例如： 
 *              var Dante = require('dantejs');
 *              var emitter = new Dante.EventEmitter();
 *              //添加事件处理队列函数
 *              emitter.on('change',function(newValue,oldValue){  console.log('something is changed');});
 *              //触发事件，并且实行事件的队列函数
 *              emitter.emit('change',newValue,oldValue);
 */
function EventEmitterLibraryClass() {
    this.regHandlers = {};
}

//继承于基础类
Base.driver(EventEmitterLibraryClass);

/**
 * @module EventEmitter 
 */

/** 
 * 名称：添加衣蛾指定事件的处理函数 该函数仅执行一次
 * @param name 事件名称
 * @param handler 事件函数
 */
EventEmitterLibraryClass.prototype.once = function(name, handler) {
    if (Strings.isBlank(name)) {
        return;
    }
    if (!Type.isFunction(handler)) {
        return;
    }
    var self = this;
    var onceHandler = function() {
        if (onceHandler.called) {
            self.off(name, onceHandler);
            handler = name = self = onceHandler = null;
        } else {
            onceHandler.called = true;
            handler.apply(this, arguments);
        }
    }
    this.on(name, onceHandler);
}

/**
 * 名称：添加一个指定事件的处理函数
 * @param name 事件名称
 * @param handler 事件处理函数
 */
EventEmitterLibraryClass.prototype.on = function(name, handler) {
    if (name === null || name === '') {
        return;
    }
    var handlers = this.getListeners(name);
    if (typeof handler == 'function') {
        handlers.push(handler);
    }
}

/**
 * 名称：移除一个指定事件的处理函数
 * @param name 事件名称 
 * @param handler 事件处理函数 如果handler参数为null 则取消当前事件的所有已绑定的函数
 */
EventEmitterLibraryClass.prototype.off = function(name, handler) {
    var handlers = this.getListeners(name);
    if (arguments.length === 1) {
        handlers.length = 0;
    } else {
        Arrays.querySplice(handlers, function(h) {
            return h === handler;
        });
    }
}

/**
 * 名称：销毁事件容器
 */
EventEmitterLibraryClass.prototype.destroy = function() {
    var allHandlers = this.regHandlers || {};
    for (var i in allHandlers) {
        if (Type.isArray(allHandlers[i])) {
            allHandlers[i].length = 0;
        } else {
            allHandlers[i] = null;
        }
    }
}

/**
 * 名称：获取指定事件的已注册的事件列表
 */
EventEmitterLibraryClass.prototype.getListeners = function(name) {
    if (name === null || name === "") {
        return [];
    }
    var handlers = this.regHandlers[name];
    if (handlers == null) {
        handlers = this.regHandlers[name] = [];
    }
    return handlers;
}

/**
 * 名称：执行指定事件
 */
EventEmitterLibraryClass.prototype.emit = function(name, arg1, argN) {
    var handlers = this.getListeners(name);
    var args = Array.prototype.slice.call(arguments, 1);
    var returnValue = null;
    Arrays.each(handlers, function(handler) {
        returnValue = handler.apply(global, args);
        return returnValue;
    });
    return returnValue;
}


//引用附加
module.exports = EventEmitterLibraryClass;