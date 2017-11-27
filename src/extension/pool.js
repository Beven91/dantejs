/**
 * 名称：队列池
 * 日期：2016-09-19
 * 描述：用于存放处理队列，并且队列按照指定间隔执行
 */
var Base = require('../base/base.js');
var Type = require('../base/type.js');
var Fn = require('../base/function.js');
var List = require('../base/list.js');
var Timer = require('./timer.js');
var EventEmitter = require('./emitter.js');

/**
 * @module QueuePool 
 */

/** 
 * 队列池构造函数
 */
function QueuePool() {
    this.init();
}

//继承于基础类
Base.driver(QueuePool);

/**
 * 初始化队列池
 */
QueuePool.prototype.init = function() {
    //初始化轮询计时器 默认间隔 1s
    this.timer = setInterval(Fn.bind(this, this.iterator), 1e3);
    //初始化集合
    this.queuesMap = {};
    this.current = 0;
}

/**
 * 启动队列池
 */
QueuePool.prototype.start = function() {
    this.isKeeping = true;
}

/**
 * 停止队列池执行
 */
QueuePool.prototype.stop = function() {
    this.isKeeping = false;
    this.current = 0;
}

/**
 * 添加队列
 * @param interval 间隔单位s
 * @param handelr 队列函数  场景： handelr(lock,context){   lock(true/false);//锁定队列        }
 * @param rightNow 是否在加入队列时执行一次 默认false
 * @param context 执行handler时传递给handler的参数
 */
QueuePool.prototype.when = function(interval, handler, rightNow, context) {
    tryThrowDecimal(interval, "参数：interval 必须为大于0的数值 interval");
    tryThrowFunction(handler, "参数：handler 必须为Function类型");
    var queues = this.queuesMap[interval];
    if (!queues) {
        queues = this.queuesMap[interval] = new List([]);
    }
    //locked 是否锁定此队列 在锁定此队列后，当下个间隔到来时，不会执行此队列
    var queue = {
        locked: false,
        interval: interval,
        handler: handler,
        context: context
    };
    //加入队列
    queues.add(queue);

    //是否添加进队列立即执行一次？
    if (rightNow) {
        doQueue.call(this, queue, true)
    }
    return this;
}

/**
 * 名称：清空队列池
 */
QueuePool.prototype.clear = function() {
    this.queuesMap = {};
}

/**
 * 名称：移除指定队列
 */
QueuePool.prototype.remove = function(handler) {
    var queuesMap = this.queuesMap;
    var keys = this.getKeys(queuesMap);
    var queueList = null;
    for (var i = 0, k = keys.length; i < k; i++) {
        queueList = queuesMap[keys[i]];
        queueList.remove(queueFilter(handler));
    }
}

/**
 * 移除指interval队列
 * @param interval 指定间隔 单位 s/秒
 */
QueuePool.prototype.removeByInterval = function(interval) {
    var queueList = this.queuesMap[interval];
    if (queueList) {
        delete this.queuesMap[interval];
    }
}

/**
 * 轮询
 */
QueuePool.prototype.iterator = function() {
    var current = ++this.current;
    if (this.isKeeping) {
        var queuesMap = this.queuesMap;
        var keys = this.getKeys(queuesMap);
        var interval = null;
        for (var i = 0, k = keys.length; i < k; i++) {
            interval = Number(keys[i]);
            if (current % interval === 0) {
                doQueues.call(this, queuesMap[interval]);
            }
        }
    }
}

/**
 * 执行指定间隔队列
 */
function doQueues(queueList, isFirst) {
    for (var i = 0, k = queueList.count(); i < k; i++) {
        doQueue.call(this, queueList.item(i))
    }
}

/**
 * 执行指定队列
 */
function doQueue(queue, force) {
    if (!queue.locked && queue.interval > 0 || force) {
        try {
            queue.handler.call(window, getLocker.call(this, queue), getQueueUpdater.call(this, queue), queue.context);
        } catch (ex) {
            console.error(ex.stack);
        }
    }
}


/**
 * 获取锁
 */
function getLocker(queue) {
    return function(locked) {
        queue.locked = locked;
    }
}

/**
 * 获取修改队列interval函数
 */
function getQueueUpdater(queue) {
    var context = this;
    return function(interval) {
        tryThrowDecimal(interval);
        if (queue.interval != interval) {
            context.remove(queue.handler);
            queue.interval = interval;
            var queues = context.queuesMap[interval];
            if (!queues) {
                queues = context.queuesMap[interval] = new List([]);
            }
            queues.add(queue);
        }
    }
}

/**
 * 检测是否为数字
 */
function tryThrowDecimal(v, message) {
    if (isNaN(v)) {
        throw new Error(message);
    }
}

/**
 * 检测是否函数，不是函数则抛出异常
 */
function tryThrowFunction(v, message) {
    if (!Type.isFunction(v)) {
        throw new Error(message);
    }
}

function queueFilter(handler) {
    return function(v) {
        return v.handler == handler;

    }
}


//公布QueuePool
module.exports = QueuePool;