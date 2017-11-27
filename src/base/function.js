/*******************************************************
 * 名称：链尚网通用库库文件：
 * 日期：2016-10-27
 * 描述：函数的扩展
 *******************************************************/
var Base = require('./base.js');
var Type = require('./type.js');
var Strings = require('./string.js');

/**
 * @module Function
 */

/** 
 * 名称：函数的扩展
 */
function FunctionLibraryClass() {}

//继承于基础类
Base.driver(FunctionLibraryClass);

/**
 * 名称：将传入的函数转交给指定的对象执行 如果传入的函数不为函数类型 不触发异常
 * @param invoker 函数调用者
 * @param fn    函数
 * @param ...args 函数对应的参数 
 * 
 * @example
 *          var Dante = require('dantejs');
 *          var obj = {name:'hello'};
 *          var fn = function(arg1,arg2){ alert(arg1+arg2+this.name); }
 *          Dante.Fn.call(obj,fn,'h','b');  > alert: 'bhhello';
 *          
 */
FunctionLibraryClass.prototype.call = function(invoker, fn, arg1, arguN) {
    if (Type.isFunction(fn) && invoker) {
        var args = this.argumentsArray(arguments, 2);
        var s = fn.apply(invoker, args);
        args = invoker = fn = arg1 = arguN = null;
        return s;
    }
}

/**
 * 名称：将传入的函数转交给指定的对象执行 如果传入的函数不为函数类型 不触发异常
 * @param invoker 函数调用者
 * @param fn    函数
 * @param [args...] 函数对应的参数 
 * @example
 *          var Dante = require('dantejs');
 *          var obj = {name:'hello'};
 *          var fn = function(arg1,arg2){ alert(arg1+arg2+this.name); }
 *          Dante.Fn.apply(obj,fn,['h','b']);  > alert: 'bhhello';
 */
FunctionLibraryClass.prototype.apply = function(invoker, fn, args) {
    if (Type.isFunction(fn) && invoker) {
        var s = fn.apply(invoker, args);
        invoker = fn = null;
        return s;
    }
}

/**
 * 名称：返回一个劫持函数，被劫持函数handler调用者转向至getCall调用者，函数柯里化....
 * @param invoker 调用者 默认为window
 * @param handler 待调用的函数 注意：在调用时函数中的this指向当前实例
 * @param closureArgs 额外传递给handler的参数,注意 该参数使用位于handler最后一个 例如：handler(args1,arg2,arg3,...,closureArgs)
 * 
 * @example
 *          var Dante = require('dantejs');
 *          var obj = {name:'hello'};
 *          var fn = function(arg1,arg2,last_is_context){ alert(arg1+arg2+this.name); }
 *          var bindFn = Dante.Fn.bind(invoker,fn,{id:2})
 *          bindFn(1,2); > alert: '12hello';
 */
FunctionLibraryClass.prototype.bind = function(invoker, handler, closureArgs) {
    if (typeof handler !== 'function') {
        throw new Error('handler must be a function !');
    }
    var delayHandler = function() {
        invoker = invoker || this;
        var args = Array.prototype.slice.call(arguments, 0);
        args.push(closureArgs);
        invoker.___caller = this;
        var v = handler.apply(invoker, args);
        invoker.___caller = null;
        return v;
    }
    return delayHandler;
};

/**
 * 名称：返回一个劫持函数，该函数仅能调用一次，多次调用无效，被劫持函数handler调用者转向至getCall调用者，函数柯里化....
 * @param invoker 调用者 默认为window
 * @param handler 待调用的函数 注意：在调用时函数中的this指向当前实例
 * @param closureArgs 额外传递给handler的参数,注意 该参数使用位于handler最后一个 例如：handler(args1,arg2,arg3,...,closureArgs)
 * 
 * @example
 *          var Dante = require('dantejs');
 *          var obj = {name:'hello'};
 *          var fn = function(arg1,arg2,last_is_context){ alert(arg1+arg2+this.name); }
 *          var bindFn = Dante.Fn.bind(invoker,fn,{id:2})
 *          bindFn(1,2); > alert: '12hello';
 *          bindFn(1,2); > 不执行任何操作
 */
FunctionLibraryClass.prototype.once = function(invoker, handler, closureArgs) {
    if (typeof handler !== 'function') {
        throw new Error('handler must be a function !');
    }
    var calleed = false;
    var delayHandler = function() {
        if (calleed === true) {
            handler = null;
            return;
        }
        calleed = true;
        invoker = invoker || window;
        var args = Array.prototype.slice.call(arguments, 0);
        args.push(closureArgs);
        return handler.apply(invoker, args);
    }
    return delayHandler;
};

//公布引用
module.exports = new FunctionLibraryClass();