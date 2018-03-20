/**
 * 名称:计时工具
 * 日期:2015-11-27
 * 描述: 时间轮询操作工具,例如:包含快速开启一个倒计时操作,以及开启一个计时器操作等等
 */
var Base = require('./base.js');
var Type = require('./type.js');
var Strings = require('./string.js');
var Arrays = require('./array.js');
var EventEmitter = require('./event-emitter');

var identifier = 0;

/**
 * @module Timer 
 */

/** 
 * 计时器工具构造函数
 */
function TimerLibraryClass(interval) {
    if (isNaN(interval) || interval <= 0) {
        throw new Error("interval 必须为>0的数字  单位为:毫秒");
    }
    return (new TimerInnerClass(interval))
}

/**
 * 计时器工具内部类构造函数
 * @param interval 间隔 单位:毫秒
 */
function TimerInnerClass(interval) {
    this.id = identifier++;
    this.emitter = new EventEmitter();
    this.init.apply(this, arguments);
}

//继承于基础类
Base.driver(TimerLibraryClass);

/**
 * 静态函数:开启一个计时器
 * @param interval 间隔时间 单位:毫秒
 */
TimerLibraryClass.interval = function(millSeconds) {
    return new TimerLibraryClass(millSeconds);
}

/**
 * 静态函数:开启一个倒计时
 * @param total 开始数字 默认:秒
 * @type {null}
 */
TimerLibraryClass.counter = function(total) {
    return new CountDownLibraryClass(total);
}

TimerInnerClass.prototype.timerId = 0;

//setTimeout id
TimerInnerClass.prototype.id = null;

//是否能够继续
TimerInnerClass.prototype.keeping = false;

//事件容器
TimerInnerClass.prototype.emitter = null;

/**
 * 初始化计时器
 */
TimerInnerClass.prototype.init = function(interval) {
    this.interval = interval;
    if (isNaN(interval) || interval <= 0) {
        throw new Error("interval 必须为>0的数字 单位为:毫秒");
    }
}

/**
 * 名称: 开始计时器工具 ,并且调用绑定的step任务
 */
TimerInnerClass.prototype.start = function() {
    if (!this.keeping) {
        this.keeping = true;
        this.stopif(this.emitter.emit('iterator'));
        this.iterate();
    }
}

/**
 * 名称: 停止计时器工具运行
 */
TimerInnerClass.prototype.stop = function() {
    this.keeping = false;
    clearTimeout(this.timerId);
}

/**
 * 名称: 绑定当前计时器每次运行的迭代函数
 */
TimerInnerClass.prototype.iterate = function(handler) {
    if (this.keepif()) {
        var self = this;
        clearTimeout(this.timerId);
        var id = setTimeout(function() {
            self.stopif(self.emitter.emit('iterator'));
            self.iterate();
        }, this.interval);
        this.timerId = id;
    }
}

/**
 * 名称:结束监听
 */
TimerInnerClass.prototype.stopif = function(r) {
    if (r === false) {
        this.stop();
    }
}

/**
 * 名称:是否可以迭代判断
 */
TimerInnerClass.prototype.keepif = function() {
    if (!this.keeping) {
        return false;
    } else {
        //这里需要自动判断是否有迭代函数 如果没有则停止任务
        return this.emitter.getListeners('iterator').length > 0;
    }
}

/**
 * 名称: 绑定当前计时器每次运行的迭代函数
 */
TimerInnerClass.prototype.iterator = function(handler) {
    this.emitter.on('iterator', handler);
    if (this.keeping) {
        //当新的迭代函数添加进来时,如果当前计时器已经启动 则默认重新开始
        this.keeping = false;
        this.start();
    }
    return this;
}

/**
 * 倒计时工具构造函数
 */
function CountDownLibraryClass(total) {
    if (isNaN(total) || total <= 0) {
        throw new Error("interval 必须为>0的数字");
    }
    var self = this;
    self.total = total;
    self.current = total;
    this.emitter = new EventEmitter();
    self.timer = new TimerLibraryClass(1000); //默认间隔为1秒执行
    self.timer.iterator(function() {
        return self.iterate();
    });
}

//倒计时事件容器
CountDownLibraryClass.prototype.emitter = null;

/**
 * 名称:添加倒计时每步的事件函数
 * @param handler
 */
CountDownLibraryClass.prototype.iterator = function(handler) {
    this.emitter.on('step', handler);
    return this;
}

/**
 * 名称:添加倒计时结束时调用的事件函数
 * @param handler
 */
CountDownLibraryClass.prototype.complete = function(handler) {
    this.emitter.on('complete', handler);
    return this;
}

/**
 * 名称:开始倒计时
 */
CountDownLibraryClass.prototype.start = function() {
    this.timer.start();
}

/**
 * 停止倒计时
 */
CountDownLibraryClass.prototype.stop = function() {
    this.timer.stop();
}

/**
 * 名称:清空计数
 */
CountDownLibraryClass.prototype.clear = function() {
    this.stop();
    this.current = this.total;
}

/**
 * 名称:倒计时迭代函数
 * @returns {boolean}
 */
CountDownLibraryClass.prototype.iterate = function() {
    var current = this.current;
    if (current <= 0) {
        return false;
    }
    current--;
    var continueof = current > 0;
    this.emitter.emit('step', this.current, this.total);
    //这里不能用else 因为complete是紧跟着结束就执行的
    if (!continueof) {
        this.emitter.emit('complete', this.current, this.total);
    }
    this.current = current;
    return continueof;
}

//引用附加
module.exports = TimerLibraryClass;