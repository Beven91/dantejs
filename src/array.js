﻿/*******************************************************
 * 名称：链尚网通用库文件：array 辅助工具
 * 日期：2016-10-27
 * 版本：0.0.1
 * 描述：主要提供针对数组的相关操作方法
 *******************************************************/
var Base = require('./base.js');
var Type = require('./type.js');
var Strings = require('./string.js');

/**
 * @module Array
 */

/**
 * 名称：通用方法工具类
 */
function ArrayLibraryClass() {}

//继承于基础类
Base.driver(ArrayLibraryClass);

/**
 * 名称：2.始终返回一个数组 如果传入参数是数组则直接返回 否则将不为null的传入参数作为新数据的项进行返回
 * @param itemOrArray 数组或者非数组变量
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Array.ensureArray(1) > [1]
 */
ArrayLibraryClass.prototype.ensureArray = function(itemOrArray) {
    if (Type.isArray(itemOrArray)) {
        return itemOrArray;
    } else if (itemOrArray != null) {
        return [itemOrArray];
    } else {
        return [];
    }
}

/**
 * 名称:将传入的对象数组转换成键值对形式(属性值)(数组项)
 * @param arrayObject 对象数组
 * @param p 作为键的属性名称
 * @param filter 过滤值或者过滤函数 如果传入值为非函数 则默认匹配为指定属性的值
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Array.this.mapDictionary([{id:'1',name:'ss'},{'id':2,name:'bb'}] ,'id') > {1:{id:1,name:'ss'},2:{id:2,name:'bb'} }
 */
ArrayLibraryClass.prototype.mapDictionary = function(arrayObject, p, filter) {
    arrayObject = this.ensureArray(arrayObject);
    var map = {},
        v = null,
        item = null;
    for (var i = 0, k = arrayObject.length; i < k; i++) {
        item = arrayObject[i];
        v = item[p];
        if (Strings.isBlank(filter)) {
            map[v] = item;
        } else if (Type.isFunction(filter)) {
            if (filter(item)) {
                map[v] = item;
            }
        } else if (filter == v) {
            map[v] = item;
        }
    }
    return map;
}

/**
 * 名称:将传入的对象数组转换成键(属性值)值(属性值)对形式
 * @param arrayObject 对象数组
 * @param p 作为键的属性名称
 * @param vp 作为值得属性名称
 * @param filter 过滤值或者过滤函数 如果传入值为非函数 则默认匹配为指定属性的值
 * 
 *  @example
 *          var Dante = require('dantejs');
 *          Dante.Array.this.mapDictionary2([{id:'1',name:'ss'},{'id':2,name:'bb'}] ,'id','name') > {1:'ss',2:'bb' }
 */
ArrayLibraryClass.prototype.mapDictionary2 = function(arrayObject, p, vp, filter) {
    arrayObject = this.ensureArray(arrayObject);
    var map = {},
        v = null,
        item = null,
        vi;
    for (var i = 0, k = arrayObject.length; i < k; i++) {
        item = arrayObject[i];
        v = item[p];
        vi = item[vp];
        if (Strings.isBlank(filter)) {
            map[v] = vi;
        } else if (Type.isFunction(filter)) {
            if (filter(item)) {
                map[v] = vi;
            }
        } else if (filter == v) {
            map[v] = vi;
        }
    }
    return map;
}

/**
 * 名称: join对象数组指定属性
 * @param arrayObject 对象数组
 * @param p 要join的属性名称
 * @param c join字符 默认为','
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Array.arrayJoin([{id:'1',name:'ss'},{'id':2,name:'bb'}],'id') > 1,2
 *          Dante.Array.arrayJoin([{id:'1',name:'ss'},{'id':2,name:'bb'}],'id','-') > 1-2
 */
ArrayLibraryClass.prototype.arrayJoin = function(arrayObject, p, c) {
    return this.valuesArray(arrayObject, p).join(c);
}

/**
 * 名称:获取对象数组指定属性值 返回一个属性值数组 例如:[{name:'1',a:'ss'},{'name':'x',}] --> [1,'x']
 * @param arrayObject 对象数组 如果该参数为对象则会默认转换为对象数组
 * @param p 属性名称 可以是属性名称数组
 * @param unique 属性值是否唯一
 * @param nullable 是否保留为空或者空字符串的属性值
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Array.valuesArray([{id:'1',name:'ss'},{'id':2,name:'bb'}],'id') > [1,2]
 *          Dante.Array.valuesArray([{id:'1',name:'ss'},{'id':2,name:'bb'},{'id':1,name:'cc'}],'id',true) > [1,2]
 *          Dante.Array.valuesArray([{id:'1',name:'ss'},{'id':2,name:'bb'},{'id':1,name:null}],'name',true) > ['ss','bb']
 *          Dante.Array.valuesArray([{id:'1',name:'ss'},{'id':2,name:'bb'},{'id':1,name:null}],'name',true,true) > ['ss','bb',null]
 */
ArrayLibraryClass.prototype.valuesArray = function(arrayObject, p, unique, nullable) {
    arrayObject = this.ensureArray(arrayObject);
    var values = [],
        v = null;
    for (var i = 0, k = arrayObject.length; i < k; i++) {
        v = arrayObject[i][p];
        if ((!nullable) && Strings.isEmpty(v)) {
            continue;
        } else if (unique && this.indexOf(values, v) > -1) {
            continue;
        }
        values.push(v);
    }
    return values;
}

/**
 * 名称:获取指定对象指定属性值 返回一个数组
 * @param object 对象
 * @param p 属性名 也可以是一个属性数组
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Array.valuesObject({name:'beven',age:999,sex:'2'},['name','age']); >['beven',999]
 */
ArrayLibraryClass.prototype.valuesObject = function(object, p) {
    var values = [];
    if (object && p) {
        p = this.ensureArray(p);
        for (var i = 0, k = p.length; i < k; i++) {
            values.push(object[p[i]]);
        }
    }
    return values;
}

/**
 * 名称:性能循环遍历方法
 * @param rows 海量级数据 数组
 * @param handler 处理函数
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Array.each([1,2,4],function(item,index){  
 *                
 *          })
 */
ArrayLibraryClass.prototype.each = function(rows, handler) {
    rows = this.ensureArray(rows);
    if (rows.length > 500) {
        return this.blockEach(rows, handler);
    } else {
        for (var i = 0, k = rows.length; i < k; i++) {
            if (handler(rows[i], i) === false) {
                break;
            }
        }
    }
}

/**
 * 名称:海量级数据循环遍历方法
 * @param rows 海量级数据 数组
 * @param handler 处理函数
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Array.blockEach([1,2,4],function(item,index){  
 *                
 *          })
 */
ArrayLibraryClass.prototype.blockEach = function(rows, handler) {
    if (!Type.isFunction(handler)) {
        return;
    }
    rows = this.ensureArray(rows);
    var len = rows.length,
        iterations = Math.floor(len / 8),
        others = len % 8,
        i = 0;
    if (others > 0) {
        do {
            handler(rows[i++], i);
        } while (--others > 0);
    }
    var ifBreak = false;
    var eachHandler = function(row, i) {
        if (ifBreak) {
            return;
        }
        ifBreak = handler(row, (i - 1)) === false;
    }
    while (iterations > 0) {
        eachHandler(rows[i++], i);
        eachHandler(rows[i++], i);
        eachHandler(rows[i++], i);
        eachHandler(rows[i++], i);
        eachHandler(rows[i++], i);
        eachHandler(rows[i++], i);
        eachHandler(rows[i++], i);
        eachHandler(rows[i++], i);
        if (ifBreak) {
            break;
        }
        iterations--;
    }
    handler = null;
}

/**
 * 名称：兼容方式indexOf
 * @param rows 数组对象
 * @param row 要查找的数组项
 * @param minus 是否使用== 而不是使用=== 默认使用===
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Array.indexOf([1,2,4],2); > 1
 *          Dante.Array.indexOf([1,2,4],'2'); > -1
 *          Dante.Array.indexOf([1,2,4],'2',true); > 1
 */
ArrayLibraryClass.prototype.indexOf = function(rows, row, minus) {
    var index = -1;
    var continu = true;
    rows = this.ensureArray(rows);
    this.each(rows, function(item, i) {
        continu = minus === true ? (item == row) : (item === row);
        if (continu) {
            index = i;
            return false;
        }
    });
    return index;
}

/**
 * 名称：判断指定数组中是否存在指定元素
 * @param rows 数组对象
 * @param 待判断的数组项
 * @param like 是否使用== 而不是使用=== 默认使用===
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Array.indexOf([1,2,4],2); > true
 *          Dante.Array.indexOf([1,2,4],'2'); > false
 *          Dante.Array.indexOf([1,2,4],'2',true); > true
 */
ArrayLibraryClass.prototype.contains = function(rows, row, minus) {
    return this.indexOf(rows, row, minus) > -1;
}

/**
 * 名称：兼容方式Array.filter
 * @param rows 数组对象
 * @param handler filter过滤函数 通过返回true/false来决定当前数组是否需要返回
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Array.indexOf([1,2,4],function(item,index){ return item!=2 }); > [1,4]
 */
ArrayLibraryClass.prototype.filter = function(rows, handler) {
    var filterRows = [];
    rows = this.ensureArray(rows);
    if (rows.filter) {
        filterRows = rows.filter(handler);
    } else {
        this.each(rows, function(item, i) {
            if (handler.call(rows, item, i) === true) {
                filterRows.push(item);
            }
        });
    }
    return filterRows;
}

/**
 * 名称：过滤掉数组为Null或者为空字符串，或者多个空字符的项
 * @param rows 数组
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Array.filterEmpty([1,2,4,'',null,undefined]); > [1,2,4,'']
 */
ArrayLibraryClass.prototype.filterEmpty = function(rows) {
    return this.filter(rows, filterEmptyHandler);
}

/**
 * 名称：指定数组中符合条件的项,返回被移除项
 * @param rows 数组
 * @param handler 删除条件函数
 * 
 * @example
 *          var Dante = require('dantejs');
 *          var deletedRows =Dante.Array.querySplice([1,2,2,4,4],function(item,index){return item==2;}); > [2,2]
 */
ArrayLibraryClass.prototype.querySplice = function(rows, handler) {
    rows = this.ensureArray(rows);
    var newRows = [];
    var deleteds = [];
    this.each(rows, function(row) {
        if (handler(row)) {
            deleteds.push(row);
        } else {
            newRows.push(row);
        }
    });
    rows.length = 0;
    rows.push.apply(rows, newRows);
    return deleteds;
}

/**
 * 名称:判断传入对象是否为一个不是空的数组(或者包含0个数组元素)
 * @param array
 * @returns {boolean}
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Array.isEmptyArray([]); > true
 *          Dante.Array.isEmptyArray(null); > true
 */
ArrayLibraryClass.prototype.isEmptyArray = function(array) {
    if (!Type.isArray(array)) {
        return true;
    } else {
        return array.length < 1;
    }
}


/**
 * 对象数组中指定字段的和
 * @param array 对象数组
 * @param p 属性值key
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Array.sumOf([{num:1},{num:2}],'num'); > 3
 */
ArrayLibraryClass.prototype.sumOf = function(array, p) {
    var values = this.valuesArray(array, p, false, false);
    var value = 0;
    for (var i = 0, k = values.length; i < k; i++) {
        value = value + Number(values[i]);
    }
    return value;
}

/**
 * 对象数组中指定字段的乘积
 * @param array 对象数组
 * @param p 属性值key
 * @example
 *          var Dante = require('dantejs');
 *          Dante.Array.productOf([{num:1},{num:2}],'num'); > 2
 */
ArrayLibraryClass.prototype.productOf = function(array, p) {
    var values = this.valuesArray(array, p, false, false);
    var value = 1;
    for (var i = 0, k = values.length; i < k; i++) {
        value = value * Number(values[i]);
    }
    return value;
}

/**
 * 名称:树结构数据自动分类
 * @param rows 对象数组
 * @param parentKey 父级属性
 * @param childKey 子级属性
 * @param cp 自定义对象子级数据属性名 默认为children 例如:{name:1,children:[....]}
 * @param del 默认为true 是否清除死循环属性链 例如:默认在每个数据里边会有一个parent{name:1,children:[],parent:{xxx}}
 * @param formatter 格式化器函数 例如：function(item){ item.id =s;item.key=1; }
 * 
 * @example
 *          var Dante = require('dantejs');
 *          var rows = [{id:1,parent:0,name:'beven'},{id:2,parent:1,name:'beven2'},{id:3,parent:2,name:'beven3'}];
 *          Dante.Array.classify(rows,'parent','id'); > {id:1,parent:0,name:'beven',children:[.....]}
 */
ArrayLibraryClass.prototype.classify = function(rows, parentKey, childKey, cp, del, formatter) {
    del = del == null ? true : del;
    cp = this.undef(cp, 'children');
    var pv, id, linkParent = null,
        cd = null;
    var links = {},
        childs = null,
        self = this;
    this.each(rows, function(item, i) {
        pv = item[parentKey];
        id = item[childKey];
        linkParent = links[pv];
        if (linkParent == null) {
            cd = linkParent = links[pv] = {};
            cd[cp] = [];
            linkParent[childKey] = pv;
        }
        self.call(this, formatter, item);
        childs = linkParent[cp];
        childs.push(item);
        item.parent = linkParent;
        if (links[id]) {
            item[cp] = links[id][cp];
        } else {
            links[id] = item;
            item[cp] = [];
        }
    });
    this.each(rows, function(item) {
        if ('parent' in item) {
            delete links[item[childKey]];
            if (del) {
                (delete item.parent);
            }
        }
    });
    return links;
}

/**
 * 名称:
 * @param v
 * @returns {boolean}
 */

function filterEmptyHandler(v) {
    return !Strings.isEmpty(v);
}

//引用附加
module.exports = new ArrayLibraryClass();