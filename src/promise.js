/*******************************************************
 * 名称：链尚网主框架库文件：Promise 工具类
 * 日期：2015-12-16
 * 版本：0.0.1
 * 描述：定制Promise 使其兼容低版本浏览器
 *******************************************************/
var Type = require('./type.js');
var Fn = require('./fn');
var EventEmitter = require('./event-emitter');


var STATUS = {
  pending: 'pending',
  fulfilled: 'fulfilled',
  rejected: 'rejected'
}

var identifier = 0;

/**
 * @module PromiseA  
 */

/** 
 * PromiseA+规范 构造函数
 * @constructor
 * @param resolver 任务函数
 */
function PromiseA(resolver) {
  if (!Type.isFunction(resolver)) {
    throw new Error("resolver 必须为函数");
  }
  if (this.constructor !== PromiseA) {
    throw new Error("不允许 劫持调用")
  }
  this.id = (++identifier);
  this.status = STATUS.pending;
  this.value = null;
  this.reason = null;
  this.emitter = new EventEmitter();
  PromiseA.log("create promise with id:" + this.id);
  runResolver(this, resolver);
}

//是否为调试模式
PromiseA.debug = false;

//输出日志
PromiseA.log = function (message) {
  if (PromiseA.debug) {
    console.log(message);
  }
}

//默认状态
PromiseA.prototype.status = STATUS.pending;

//返回值
PromiseA.prototype.value = null;

//拒绝原因
PromiseA.prototype.reason = null;

//函数队列容器
PromiseA.prototype.emitter = null;

/**
 * 返回一个resolve的promise
 * @param thenable 包含then函数对象
 */
PromiseA.resolve = function (thenable) {
  if (thenable instanceof PromiseA) {
    return thenable;
  } else {
    return convertThenable(thenable, STATUS.fulfilled);
  }
}

/**
 * 返回一个reject的promise
 * @param thenable 包含then函数对象
 */
PromiseA.reject = function (thenable) {
  if (thenable instanceof PromiseA) {
    return thenable;
  } else {
    return convertThenable(thenable, STATUS.rejected);
  }
}

/**
 * 名称:判断传入对象是否为一个thenable对象
 */
PromiseA.thenable = function (thenObj) {
  return (thenObj && thenObj.then && Type.isFunction(thenObj.then));
}

/**
 * 接受一个promise列表 返回一个rootPromise
 * 1.当任意一个promise reject时 当前返回的rootPromise也已同样的reason reject
 * 2.当触发onfulfilled 或者onrejected
 */
PromiseA.all = function (promises) {
  if (!Type.isArray(promises)) {
    throw new Error("参数promises 必须为一个Promise对象的数组")
  }
  var rootPromise = new PromiseA(emptyResolver);
  var total = promises.length - 1;
  var values = [];
  var keep = true;
  for (var i = 0, k = promises.length; i < k; i++) {
    handlePromise(promises[i], i);
  }
  function handlePromise(promise, i) {
    promise.then(function (value) {
      values[i] = value;
      if (keep && i == total) {
        rootPromise.resolve(values);
      }
    }, function (reason) {
      keep = false;
      rootPromise.reject(reason);
      rootPromise = null;
    });
  }
  return rootPromise;
}

/**
 * 回调处理then
 * @param resovle fulfilled状态回调函数或者thenable 选填
 * @param rejected rejected状态回调函数或者thenable 选填
 */
PromiseA.prototype.then = function (resovle, rejected) {
  var nextPromise = this.nextPromise || (this.nextPromise = new PromiseA(emptyResolver));
  switch (this.status) {
    case STATUS.pending:
      //绑定onFulfilled
      this.on(STATUS.fulfilled, resovle);
      //绑定onRejected
      this.on(STATUS.rejected, rejected);
      break;
    case STATUS.fulfilled:
      //如果状态已经为fulfilled 则直接调用resolve
      this.call(nextPromise, resovle);
      break;
    default:
      //如果状态已经为rejected 则直接调用rejected
      this.call(nextPromise, rejected);
      break;
  }
  return nextPromise;
}

/**
 * success Promise fulfilled状态
 * @param handler fulfilled回调函数
 */
PromiseA.prototype.success = function (handler) {
  return this.then(handler, null);
}

/**
 * catch Promise rejected状态
 * @param handler fulfilled回调函数
 */
PromiseA.prototype.error = PromiseA.prototype['catch'] = function (handler) {
  return this.then(emptyResolver, handler);
}

/**
 * complete Promise fulfilled与rejected均会触发
 * @param handler fulfilled与rejected回调函数
 */
PromiseA.prototype.complete = function (handler) {
  if (!Type.isFunction(handler)) {
    return;
  }
  return this.then(function (data) {
    return handler(null, data);
  },
    function (reason) {
      return handler(reason, null);
    });
}

/**
 * 将当前状态更新为fulfilled 并且调用onFulfilled
 * @param value fulfilled 状态时 的返回值
 */
PromiseA.prototype.resolve = function (value) {
  if (this.status !== STATUS.pending) {
    throw new Error('Illegal call,only pending status can call');
  }
  this.status = STATUS.fulfilled;
  this.value = value;
  var nextPromise = this.nextPromise;
  var length = this.emitter.getListeners(this.status).length;
  PromiseA.log("resolve :" + this.id + " of value");
  PromiseA.log(value);
  this.emitter.emit(this.status, value);
  //如果当前没有设置rejected回调队列 则nextPromise跟随当前promise
  if (nextPromise && length < 1) {
    nextPromise.resolve(value);
  }
}

/**
 * 将当前状态更新为rejected 并且调用onRejectd
 * @param reason rejected原因
 */
PromiseA.prototype.reject = function (reason) {
  if (this.status !== STATUS.pending) {
    throw new Error('Illegal call,only pending status can call');
  }
  this.status = STATUS.rejected;
  this.reason = reason;
  var nextPromise = this.nextPromise;
  var length = this.emitter.getListeners(this.status).length;
  PromiseA.log("rejected :" + this.id + " of reason");
  PromiseA.log(reason);
  this.emitter.emit(this.status, reason);
  //如果当前没有设置rejected回调队列 则nextPromise跟随当前promise
  if (nextPromise && length < 1) {
    nextPromise.reject(reason);
  }
}

/**
 * 立即调用
 * @param nextPromise 链式then返回的promise
 * @param resolveOrReject resolve或者reject 回调
 */
PromiseA.prototype.call = function (nextPromise, resolveOrReject) {
  var fulfilled = this.status === STATUS.fulfilled;
  var v = fulfilled ? this.value : this.reason;
  try {
    nextPromise.value = this.value;
    if (Type.isFunction(resolveOrReject)) {
      var x = resolveOrReject(v);
      this.resolveX(nextPromise, (x || this.value));
    } else if (fulfilled) {
      nextPromise.resolve(resolveOrReject);
    } else {
      nextPromise.reject(resolveOrReject);
    }
  } catch (ex) {
    console.error(ex.stack);
    nextPromise.reject(ex);
  }
}

/**
 * promise解析流程
 */
PromiseA.prototype.resolveX = function (promise, x) {
  if (promise === x) {
    promise.reject(new TypeError('x'));
  } else if (x instanceof PromiseA) {
    switch (x.status) {
      case STATUS.pending:
        //promise 将等到x执行完毕后再更新状态
        bindPromise(promise, x);
        break;
      case STATUS.fulfilled:
        //更新状态为fulfilled
        promise.resolve(x.value);
        break;
      default:
        //更新状态为rejected
        promise.reject(x.reason);
        break;
    }
  } else {
    resolveThenable(promise, x, this.status);
  }
}

/**
 * 添加指定状态的回调队列函数
 * @param name 状态名称
 * @param handler 回到函数
 */
PromiseA.prototype.on = function (name, handler) {
  var promise = this;
  var nextPromise = this.nextPromise;
  if (Type.isFunction(handler)) {
    this.emitter.once(name, function () {
      promise.call(nextPromise, handler);
    });
  }
}

/**
 * 空处理函数
 */
function emptyResolver() {

}

/**
 * 开始执行初始任务
 */
function runResolver(promise, resolver) {
  setTimeout(function () {
    try {
      resolver(function (value) {
        if (promise) {
          promise.resolve(value);
        }
        promise = null;
      }, function (reason) {
        if (promise) {
          promise.reject(reason);
        }
        promise = null;
      });
    } catch (ex) {
      promise.reject(ex);
      console.error(ex.stack);
    }
  }, 10);
}

/**
 * 挂在promise 到thenable上
 * @parma promise promise对象
 * @param thenable thenable 对象
 * @param status 状态
 */
function resolveThenable(promise, thenable, status) {
  if (PromiseA.thenable(thenable)) {
    bindPromise(promise, thenable);
  } else if (status == STATUS.fulfilled) {
    promise.resolve(thenable);
  } else {
    promise.reject(thenable);
  }
  return promise;
}

/**
 * 将thenable 转换成PromiseA
 */
function convertThenable(thenable, status) {
  var promise = new PromiseA(emptyResolver);
  return resolveThenable(promise, thenable, status);
}

/**
 * 绑定promise 到另一个promise后执行
 * @param promise1 待绑定promise
 * @param promise2 目标promise
 */
function bindPromise(promise1, promise2) {
  promise2.then(Fn.bind(this, thenableResolveCallback, promise1), Fn.bind(this, thenableRejectdCallback, promise1));
}

/**
 * 转换thenable 时的代理fulfilled回调函数
 */
function thenableResolveCallback(value, args) {
  var promise = arguments[arguments.length - 1];
  if (value === promise) {
    promise.reject(new TypeError("value"));
  } else {
    promise.resolve(value);
  }
}

/**
 * 转换thenable 时的代理rejected回到函数
 */
function thenableRejectdCallback(reason) {
  var promise = arguments[arguments.length - 1];
  promise.reject(reason);
}

module.exports = PromiseA;