/*******************************************************
 * 名称：链尚网通用库文件：类型检测工具
 * 日期：2016-10-27
 * 版本：0.0.1
 * 描述：主要提供js基础数据类型的检测
 *******************************************************/
var Base = require('./base.js');


/**
 * @module Type 
 */

/** 
 * 类型检测构造函数
 */
function TypeLibraryClass() {}

//继承于基础类
Base.driver(TypeLibraryClass);

/**
 * 名称：指定传入值是否为指定类型
 * @param obj 待检测的数据
 * @param type 目标类型
 * 
 * @example 
 *         var Dante = require('dantejs');
 *          Dante.Type.isType('beven','String'); //> true
 *          Dante.Type.isType(10,'Number'); //> true
 */
TypeLibraryClass.prototype.isType = function(obj, type) {
    return Object.prototype.toString.call(obj) == "[object " + type + "]";
}

/**
 * 名称：获取指定值得类型名称 例如：var num=1; 返回Number
 * @param obj 值
 * 
 * @example 
 *         var Dante = require('dantejs');
 *          Dante.Type.nameType('beven'); //>'String'
 *          Dante.Type.nameType(10); //> 'Number'
 */
TypeLibraryClass.prototype.nameType = function(obj) {
    return Object.prototype.toString.call(obj).replace("[object ", "").replace("]", "");
}

/**
 * 名称：判断传入对象是否为指定类型的类，或者指定类型的实例
 * @param obj 待检测实例
 * @param targetClass 目标类型
 * 
 * @example 
 *         var Dante = require('dantejs');
 *         Dante.Type.isClass(obj,SuperClass); //> true/false
 *         Dante.Type.isClass(SubClass,SuperClass); //> true/false
 */
TypeLibraryClass.prototype.isClass = function(obj, targetClass) {
    if (this.isObject(obj)) {
        return obj instanceof targetClass;
    } else if (this.isFunction(obj)) {
        return obj.prototype instanceof targetClass;
    } else {
        return false;
    }
}

/**
 * 名称：检测传入对象是否为数组类型
 * @param obj 待检测对象
 * 
 * @example 
 *         var Dante = require('dantejs');
 *          Dante.Type.isArray('beven'); //> false
 *          Dante.Type.isArray([1,2,3]); //> true
 */
TypeLibraryClass.prototype.isArray = function(obj) {
    return this.isType(obj, "Array");
}

/**
 * 名称：检测传入对象是否为函数类型
 * @param obj 待检测对象
 * 
 * @example 
 *         var Dante = require('dantejs');
 *          Dante.Type.isFunction('beven'); //> false
 *          Dante.Type.isFunction(function(){}); //> true
 */
TypeLibraryClass.prototype.isFunction = function(obj) {
    return this.isType(obj, "Function");
}

/**
 * 名称：检测传入对象是否为Object类型
 * @param obj 待检测对象
 * 
 * @example 
 *         var Dante = require('dantejs');
 *          Dante.Type.isObject('beven'); //> false
 *          Dante.Type.isObject({}); //> true
 */
TypeLibraryClass.prototype.isObject = function(obj) {
    return this.isType(obj, "Object");
}

/**
 * 名称：检测传入对象是否为Boolean类型
 * @param obj 待检测对象
 * 
 * @example 
 *         var Dante = require('dantejs');
 *         Dante.Type.isBoolean(true); //> true
 *         Dante.Type.isBoolean(false); //> true
 *         Dante.Type.isBoolean(0); //> false
 */
TypeLibraryClass.prototype.isBoolean = function(obj) {
    return this.isType(obj, "Boolean");
}

/**
 * 名称：检测传入对象是否为Date类型
 * @param obj 待检测对象
 * 
 * @example 
 *         var Dante = require('dantejs');
 *         Dante.Type.isDate(''); //> false
 *         Dante.Type.isDate(new Date()); //> true
 */
TypeLibraryClass.prototype.isDate = function(obj) {
    return this.isType(obj, "Date");
}

/**
 * 名称：检测传入对象是否为String类型
 * @param obj 待检测对象
 * 
 * @example 
 *         var Dante = require('dantejs');
 *         Dante.Type.isString(''); //> true
 *         Dante.Type.isString(new Date()); //> false
 */
TypeLibraryClass.prototype.isString = function(obj) {
    return this.isType(obj, "String");
}

/**
 * 名称：检测传入对象是否为Nummber类型
 * @param obj 待检测对象
 * 
 * @example 
 *         var Dante = require('dantejs');
 *         Dante.Type.isNumber(0); //> true
 *         Dante.Type.isNumber('0'); //> false
 */
TypeLibraryClass.prototype.isNumber = function(obj) {
    return this.isType(obj, "Number");
}

/**
 * 名称:检测传入参数 是否为object类型,并且不是null
 * @param obj  待检测的对象
 * 
 * @example 
 *         var Dante = require('dantejs');
 *         Dante.Type.isNnObject(null); //> false
 *         Dante.Type.isNnObject({}); //> true
 */
TypeLibraryClass.prototype.isNnObject = function(obj) {
    if (obj == null) {
        return false;
    } else {
        return this.isObject(obj);
    }
}

//引用附加
module.exports = new TypeLibraryClass();