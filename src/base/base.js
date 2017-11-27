/*******************************************************
 * 名称：链尚网通用库文件：框架库类的基类
 * 日期：2016-10-26
 * 描述：仅供日后扩展用，目前所有标准框架库文件类均继承与当前类
 *******************************************************/

/**
 * @module Base
 */

/**
 * 名称：主框架对象基础类
 */
function BaseObjectClass() {}

/**
 * 名称：使指定构造函数继承于指定构造函数
 * 注意：请在构造函数原型没有自定义函数或者属性前使用此方法进行继承，否则会覆盖之前原型的方法
 * 说明：当前仅仅是构造一个面向对象的继承环境，便于以后进行扩展，并不打算建立全面，完整的继承体系
 * @param SubClass 子类
 * @param SuperClass 父类a
 */
BaseObjectClass.extend = function(SubClass, SuperClass) {
    var origin = SubClass.prototype;
    SubClass.prototype = new SuperClass();
    SubClass.prototype.constructor = SubClass;
    SubClass.prototype.__super = SubClass.prototype;
    BaseObjectClass.prototype.doAssign.call(BaseObjectClass.prototype, SubClass.prototype, origin);
    return SubClass;
}

/**
 * 名称：使指定构造函数继承于当前基础类
 * 注意：请在构造函数原型没有自定义函数或者属性前使用此方法进行继承，否则会覆盖之前原型的方法
 * 说明：当前仅仅是构造一个面向对象的继承环境，便于以后进行扩展，并不打算建立全面，完整的继承体系
 * @param SubClass 子类
 */
BaseObjectClass.driver = function(SubClass) {
    BaseObjectClass.extend(SubClass, this);
}

/**
 * 复制一级属性值，将...source对象的属性复制到target对象中去
 * @param target 目标对象
 * @param ...source 来源对象 
 */
BaseObjectClass.prototype.doAssign = function(target, source1, sourceN) {
    if (null == target) {
        throw new Error("target 不能为null");
    }
    var source = null;
    var sources = this.argumentsArray(arguments, 1);
    for (var i = 0, k = sources.length; i < k; i++) {
        source = sources[i];
        for (var key in source) {
            target[key] = source[key];
        }
    }
    return target;
}

/**
 * 将arguments函数转换成array
 * @param args arguments 对象
 * @param start 默认为0 等同Array.prototype.slice的start参数
 * @param end  默认为结尾 等同Array.prototype.slice的end参数
 */
BaseObjectClass.prototype.argumentsArray = function(args, start, end) {
    start = start || 0;
    end = end || args.length;
    return Array.prototype.slice.call(args, start, end);
}

/**
 * 名称：返回一个对象的属性keys
 * @param obj 对象
 */
BaseObjectClass.prototype.getKeys = function(obj) {
    if (Object.keys) {
        return Object.keys(obj);
    } else {
        var keys = [];
        for (var i in obj) {
            keys.push(i);
        }
        return keys;
    }
}


/**
 * 名称：返回一个对象的指定类型属性keys
 * @param obj 对象
 * @param type 类型 例如：Number String Date ....
 */
BaseObjectClass.prototype.ofKeys = function(obj, type) {
    var keys = [];
    for (var i in obj) {
        if (Type.isType(obj[i], type)) {
            keys.push(i);
        }
    }
    return keys;
}

/**
 * 两个值逻辑比较
 * @param v1 值1
 * @param v2 值2
 * @param logic
 */
BaseObjectClass.prototype.logicOf = function(v1, v2, logic) {
    var r = false;
    switch (logic) {
        case '=':
            r = v1 == v2;
            break;
        case '!=':
            r = v1 != v2;
            break;
        case '>':
            r = v1 > v2;
            break;
        case '<':
            r = v1 < v2;
            break;
        case '>=':
            r = v1 >= v2;
            break;
        case '<=':
            r = v1 <= v2;
            break;
        default:
            break;
    }
    return r;
}

//公布引用
module.exports = BaseObjectClass;