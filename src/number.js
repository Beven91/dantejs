/*******************************************************
 * 名称：链尚网通用库库文件：
 * 日期：2016-10-27
 * 描述：Number操作的扩展
 *******************************************************/
var Base = require('./base.js');
var Type = require('./type.js');
var Strings = require('./string.js');

/**
 * @module Number 
 */

/** 
 * 名称：函数的扩展
 */
function NumberLibraryClass() {}

//继承于基础类
Base.driver(NumberLibraryClass);

/**
 * 名称：始终返回一个数字类型 如果传入值不值一个数值，则可以指定默认值 如果没有指定默认值则系统默认会返回0
 * @param num 可能是数值的参数
 * @param dv  如果num为null或者undefined 或者空字符串 则使用此默认值
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Number.ensureDecimal('0');  > 0
 *          Dante.Number.ensureDecimal('');  > 0
 *          Dante.Number.ensureDecimal(null);  > 0
 *          Dante.Number.ensureDecimal(undefined);  > 0
 *          Dante.Number.ensureDecimal('1');  > 1
 */
NumberLibraryClass.prototype.ensureDecimal = function(num, dv) {
    if (isNaN(num) || Strings.isBlank(num)) {
        return this.ensureDecimal(dv, 0);
    } else if (Type.isNumber(num)) {
        return num;
    } else {
        return Number(num);
    }
}

/**
 * 名称：计算多个数字进行乘法运算
 * @param ...numbers 需要相乘的参数
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Number.ensureDecimal(1,2,3);  > 6
 */
NumberLibraryClass.prototype.mul = function(arg1, arg2, argN) {
    var v = 1;
    var isCaculated = false;
    var numArray = Array.prototype.splice.call(arguments, 0, arguments.length);
    for (var i = 0, k = numArray.length; i < k; i++) {
        v = v * this.ensureDecimal(numArray[i], 1);
        isCaculated = true;
    }
    if (!isCaculated) {
        v = 0;
    }
    return v;
}

//公布引用
module.exports = new NumberLibraryClass();