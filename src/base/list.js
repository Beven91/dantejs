﻿/*******************************************************
 * 名称：链尚网主框架库文件：集合代理类
 * 日期：2016-10-27
 * 版本：0.0.1
 * 描述：支持代理数组的查询，移除，添加，批量添加等操作
 *******************************************************/
var Base = require('./base.js');
var Type = require('./type.js');
var Arrays = require('./array.js');
var Strings = require('./string.js');

/**
 * @module List
 */

/** 
 * 名称：集合代理构造函数
 */
function ListLibraryClass(oriJsonArray) {
    InitListClass.apply(this, arguments);
}

//继承于基础类
Base.driver(ListLibraryClass);

//集合代理原数组
ListLibraryClass.prototype.items = null;

/**
 * 名称：添加一项到集合中去,如果存在则不进行添加
 */
ListLibraryClass.prototype.addOnly = function(obj) {
    if (!this.contains(obj)) {
        this.add(obj);
    }
}

/**
 * 名称：添加一项对象到集合中去
 */
ListLibraryClass.prototype.add = function(obj) {
    this.items.push(obj);
}

/**
 * 名称：将制定数组添加集合中去
 */
ListLibraryClass.prototype.addRange = function(jsonArray) {
    if (Type.isClass(jsonArray, ListLibraryClass)) {
        jsonArray = jsonArray.items;
    }
    jsonArray = Arrays.ensureArray(jsonArray);
    this.items.push.apply(this.items, jsonArray);
}

/**
 * 名称：迭代当前集合
 */
ListLibraryClass.prototype.each = function(handler) {
    return Arrays.each(this.items, handler);
}

/**
 * 名称：是否包含传入项
 * @param obj 待检测的项
 */
ListLibraryClass.prototype.contains = function(obj) {
    return this.indexOf(obj) > -1;
}

/**
 * 名称:判断当前集合是否包含指定集合或者数组
 * @param compareListOrArray 待判断集合或者数组
 * @param name  匹配项的属性名称
 *              例如: 'id' (当前集合与compareListOrArray中对象使用同名属性'id'值进行匹配)
 *              或者'id:name' (当前集合项使用id属性与compareListOrArray数组项属性name值进行匹配是否相等
 *              或者name为function 例如: function(originItem,compareItem){ return originItem.name==compareItem.id; }
 */
ListLibraryClass.prototype.includes = function(compareListOrArray, name) {
    var compareArray = null;
    var compareHandler = null,
        r;
    if (name == null) {
        throw new Error('必须填写比较器,可以是属性名称(例如:id)或者属性对(例如 id:name)或者属性比较器(例如:function(a,b){ return a.id==b.id}');
    }
    if (Type.isClass(compareListOrArray, ListLibraryClass)) {
        compareArray = compareListOrArray.items;
    } else if (!Type.isArray(compareListOrArray)) {
        return false;
    } else {
        compareArray = compareListOrArray;
    }
    if (Type.isFunction(name)) {
        compareHandler = name;
    } else if (name.toString().indexOf(":") > -1) {
        var kv = name.toString().split(':');
        compareHandler = getDefaultCompareHandler(kv[0], kv[1]);
    } else {
        compareHandler = getDefaultCompareHandler(name.toString());
    }
    r = (compareArray.length > 0 && this.size() > 0);
    for (var i = 0, k = compareArray.length; i < k; i++) {
        if (this.query(queryCompare(compareArray[i], compareHandler)).length < 1) {
            r = false;
            break;
        }
    }
    return r;
}

/**
 * 名称：获取集合指定范围的元素
 * @param start 开始位置（包括开始位置)
 * @param end 结束位置 (不包括结束位置)
 */
ListLibraryClass.prototype.slice = function(start, end) {
    return this.items.slice(start, end);
}

/**
 * 名称：获取当前集合总数量
 */
ListLibraryClass.prototype.size = function() {
    return this.items.length;
}

/**
 * 名称：获取指定下标的项
 */
ListLibraryClass.prototype.item = function(i) {
    return this.items[i];
}

/**
 * 名称：移除集合指定范围的元素
 * @param start 开始位置 （包括开始位置)
 * @param deleteCount 删除元素个数
 */
ListLibraryClass.prototype.splice = function(start, deleteCount) {
    return this.items.splice(start, deleteCount);
}

/**
 * 名称：移除元素
 * @param indexOrHandler 下标或者刷选函数
 * 例如：this.remove(1); 或者 this.remove(function(v){ return v.id>10;});
 */
ListLibraryClass.prototype.remove = function(indexOrHandler) {
    if (Type.isFunction(indexOrHandler)) {
        return Arrays.querySplice(this.items, indexOrHandler);
    } else if (!isNaN(indexOrHandler)) {
        this.items.splice(indexOrHandler, 1);
    } else {
        throw new Error("indexOrHandler only be a number or function");
    }
}

/**
 * 名称：移除指定元素
 */
ListLibraryClass.prototype.removeItem = function(item) {
    return Arrays.querySplice(this.items, function(v) {
        return v == item;
    });
}

/**
 * 名称：获取指定匹配的元素
 * @param handler 匹配函数 例如： function(row){return row.id==1}
 */
ListLibraryClass.prototype.query = function(handler) {
    return Arrays.filter(this.items, handler);
}

/**
 * 名称：查询集合，根据指定属性值
 * @param property 属性名
 * @param v 属性值
 * @param express 比较表达式 有: = != > < >= <= 默认为=
 */
ListLibraryClass.prototype.queryOf = function(property, v, express) {
    express = Strings.blankOf(express, '=');
    return this.query(function(item) {
        return Base.prototype.logicOf(fieldValue(item, property), v, express);
    });
}

/**
 * 名称：查询集合，查询指定项
 * @param item 集合项
 * @param express  比较表达式 有: = != > < >= <= 默认为=
 */
ListLibraryClass.prototype.queryItem = function(item, express) {
    express = Strings.blankOf(express, '=');
    return this.query(function(t) {
        return Base.prototype.logicOf(t, item, express);
    });
}

/**
 * 判断当前集合是否有元素
 */
ListLibraryClass.prototype.isEmpty = function() {
    return this.count() < 1;
}

/**
 * 名称：返回指定数据在当前集合中的下标位置
 * @param item 已存在的数据项
 */
ListLibraryClass.prototype.indexOf = function(row) {
    return Arrays.indexOf(this.items, row);
}

/**
 * 名称：查询集合 ，根据指定属性值匹配，对比值可以有多个
 * @parma property 属性名
 * @param values 匹配值列表
 */
ListLibraryClass.prototype.queryByValues = function(property, values) {
    values = Arrays.ensureArray(values);
    return this.query(function(item) {
        return Arrays.contains(values, fieldValue(item, property));
    });
}

/**
 * 名称：查询集合 ，根据对象数组的指定属性的所有值进行筛选
 * @param jsonArray 对象数组
 * @parma property 属性名
 * 例如： this.queryByArray('id',[{id:1},{id:2}]);
 */
ListLibraryClass.prototype.queryByArray = function(property, jsonArray) {
    jsonArray = Arrays.ensureArray(jsonArray);
    var values = Arrays.valuesArray(jsonArray, property);
    return this.queryByValues(property, values);
}

/**
 * toString 重写
 */
ListLibraryClass.prototype.toString = function() {
    var items = this.items || [];
    return items.toString();
}

/**
 * 返回当前集合项的个数
 */
ListLibraryClass.prototype.count = function() {
    return this.items.length;
}

/**
 * 获取集合指定下标的项
 * @param index 下标
 */
ListLibraryClass.prototype.get = function(index) {
    return this.items[index];
}

/**
 * 判断当前集合是否有元素
 */
ListLibraryClass.prototype.isEmpty = function() {
    return this.count() < 1;
}

/**
 * 移除最后一项 并且返回最后一项
 */
ListLibraryClass.prototype.pop = function() {
    return Array.prototype.pop.apply(this.items, arguments);
}

/**
 * 删除集合第一项 并且返回第一项
 */
ListLibraryClass.prototype.shift = function() {
    return Array.prototype.shift.apply(this.items, arguments);
}

/**
 * 清空集合
 */
ListLibraryClass.prototype.clear = function() {
    this.items.length = 0;
}

/**
 * 名称：获取指定项的值
 */
function fieldValue(item, field) {
    if (item && Type.isObject(item)) {
        return item[field];
    } else {
        return item;
    }
}

/**
 *
 */
function queryCompare(item, compareHandler) {
    return function(origin) {
        return compareHandler(origin, item);
    }
}

/**
 * 获取默认属性比较函数
 */
function getDefaultCompareHandler(originName, compareName) {
    if (arguments.length == 1) {
        compareName = originName;
    }
    var handler = function(originItem, compareItem) {
        if (originItem == null || compareItem == null || !Type.isObject(originItem) || !types.isObject(compareItem)) {
            return false;
        } else {
            return defaultValueCompareHandler(originItem[originName], compareItem[compareName]);
        }
    }
    return handler;
}

/**
 * 值比较器
 */
function defaultValueCompareHandler(v, v2) {
    if (v == null || v2 == null) {
        return false;
    } else {
        return v == v2;
    }
}

/**
 * 名称：初始化集合
 */
function InitListClass(jsonArray) {
    if (Type.isClass(jsonArray, ListLibraryClass)) {
        jsonArray = jsonArray.items;
    }
    this.items = Arrays.ensureArray(jsonArray);
}

//引用附加
module.exports = ListLibraryClass;