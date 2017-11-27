﻿/*******************************************************
 * 链尚网通用库文件：string 字符串操作工具
 * 日期：2016-10-27
 * 版本：0.0.1
 * 描述：主要提供字符串的相关操作函数，提高开发效率
 *******************************************************/
var Base = require('./base.js');
var Type = require('./type.js');

/**
 * @module String 
 */

/** 
 * 字符串处理类 构造函数
 */
function StringLibraryClass() {}

//继承于基础类
Base.driver(StringLibraryClass);

/**
 * 确保传入的值，始终为一个字符串，如果传入值为null或者undefined则返回def 如果def没有则返回''
 * @param maybe 传入对象
 * @param def 默认值 在maybe为null或者undefined时使用此默认值 
 * 
 * @example 
 * 
 *          var Dante = require('dantejs');
 * 
 *          Dante.String.ensure(10); // ---> '10'
 *          Dante.String.ensure(null); // ---> ''
 *          Dante.String.ensure(null,'abc'); // ---> 'abc'
 */
StringLibraryClass.prototype.ensure = function(maybe, def) {
    return this.emptyOf(maybe, this.emptyOf(def, '')).toString();
}


/**
 * 简单字符串格式化工具
 * @param str 格式化模板字符串
 * @param ...args 每个占位{0}-{N}对应的值
 * 
 * @example
 *          var Dante = require('dantejs');
 * 
 *          Dante.String.format('name:{0},age:{1}','beven',999); //--> 'name:beven,age:999'
 *          Dante.String.format('name:{0},age:{1}，{0}','beven',999); //--> 'name:beven,age:999，beven'
 */
StringLibraryClass.prototype.format = function(str, arg1, arg2, argN) {
    var args = Array.prototype.slice.call(arguments, 1, arguments.length);
    return this.ensure(str).replace(/\{\d+\}/g, function(a) {
        var s = args[a.slice(1, -1)];
        return s == null ? a : s;
    });
}

/**
 * 简单字符串格式化工具
 * @param str 格式化模板字符串
 * @param args 每个占位{0}-{N}对应的数组值[1,2,3,4]
 * 
 * @example
 *          var Dante = require('dantejs');
 *          
 *          Dante.String.format('name:{0},age:{1}',['beven',999]); //--> 'name:beven,age:999'
 * 
 */
StringLibraryClass.prototype.format2 = function(str, args) {
    args = args || [];
    args.unshift(str);
    return this.format.apply(this, args);
}

/**
 * 检测字符串str 是否以chars开头
 * @param str 原始字符串
 * @param chars 包含字符串
 * @param ignore 是否忽略大小写
 * 
 * @example
 *          var Dante = require('dantejs');
 * 
 *          Dante.String.startsWith('hello beven', "hello");
 *          //忽略大小写
 *          Dante.String.startsWith('Hello beven', "hell", true);
 *          
 */
StringLibraryClass.prototype.startsWith = function(str, chars, ignoreCase) {
    if (this.isEmptyAny(str, chars)) {
        return false;
    } else if (ignoreCase) {
        return str.substring(0, chars.length).toLowerCase() === chars.toLowerCase();
    } else {
        return str.substring(0, chars.length) === chars;
    }
}

/**
 * 检测字符串str 是否以chars开头
 * @param str 原始字符串
 * @param chars 包含字符串
 * @param ignore 是否忽略大小写
 * 
 * @example
 *          var Dante = require('dantejs');
 * 
 *          Dante.String.endsWith('hello beven', "beven");
 *          //忽略大小写
 *          Dante.String.endsWith('Hello Beven', "beven", true);
 * 
 */
StringLibraryClass.prototype.endsWith = function(str, chars, ignoreCase) {
    if (this.isEmptyAny(str, chars)) {
        return false;
    } else if (ignoreCase) {
        return str.substring(str.length - chars.length).toLowerCase() === chars.toLowerCase();
    } else {
        return str.substring(str.length - chars.length) === chars;
    }
}

/**
 * 去掉字符串左右两边的空格
 * @param s 字符串
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.trim(' beven ');
 */
StringLibraryClass.prototype.trim = function(s) {
    return this.trimRight(this.trimLeft(s));
}

/**
 * 却掉指定字符串的所有空格
 * @param s 字符串
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.trimAll(' be ven ');
 */
StringLibraryClass.prototype.trimAll = function(s) {
    return this.ensure(s).replace(/\s+/g, '');
}

/**
 * 去掉字符串(s)左侧开头的指定字符串(trim)（默认为空格)
 * @param s 字符串
 * @param trim 开头要去除的字符串 默认为空格
 * @param rep  如果字符串s开头存在trim，则替换成req  req默认：''
 * @param ignoreCase 是否忽略大小写，在指定trim时
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.trimLeft('  beven ') //---> 'beven '
 *          Dante.String.trimLeft('  beven ','','abc') //---> 'abcbeven '
 *          Dante.String.trimLeft('abcbevenabc ','abc') //---> 'bevenabc '
 *          //忽略大小写
 *          Dante.String.trimLeft('Abcbevenabc', 'abc',true)
 *  
 */
StringLibraryClass.prototype.trimLeft = function(s, trim, rep, ignoreCase) {
    if (arguments.length == 3 && Type.isBoolean(rep)) {
        ignoreCase = rep;
        rep = null;
    }
    var value = this.blankOf(trim, '\\s+');
    var exp = this.format('^{0}', value);
    var ops = ignoreCase ? 'gi' : 'g';
    var regExp = new RegExp(exp, ops);
    return this.ensure(s).replace(regExp, this.emptyOf(rep, ''));
}

/**
 * 去掉字符串(s)左侧开头的指定字符串(trim)（默认为空格)
 * @param s 字符串
 * @param trim 开头要去除的字符串 默认为空格
 * @param rep  如果字符串s开头存在trim，则替换成req  req默认：''
 * @param ignoreCase 是否忽略大小写，在指定trim时
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.trimRight('beven ') //---> 'beven'
 *          Dante.String.trimRight('beven    ','','abc') //---> 'bevenabc '
 *          Dante.String.trimRight('bevenabc ','abc') //---> 'beven'
 *          忽略大小写
 *          Dante.String.trimRight('bevenAbc', 'abc')
 */
StringLibraryClass.prototype.trimRight = function(s, trim, rep, ignoreCase) {
    if (arguments.length == 3 && Type.isBoolean(rep)) {
        ignoreCase = rep;
        rep = null;
    }
    var value = this.blankOf(trim, '\\s+');
    var exp = this.format('{0}$', value);
    var ops = ignoreCase ? 'gi' : 'g';
    var regExp = new RegExp(exp, ops);
    return this.ensure(s).replace(regExp, this.emptyOf(rep, ''));
}

/**
 * 判断指定字符串是否为null或者undefined
 * @param s 字符串
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.isEmpty(str);
 */
StringLibraryClass.prototype.isEmpty = function(s) {
    return !(s !== null && s !== undefined);
}

/**
 * 判断传入字符串参数列表是否存在一项为null或者undefined
 * @param ...strList 字符串列表
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.isEmptyAny(str1,str2,str2);
 */
StringLibraryClass.prototype.isEmptyAny = function(s, s1, s2) {
    var str = null;
    var hasEmpty = false;
    var strList = this.argumentsArray(arguments);
    for (var i = 0, k = strList.length; i < k; i++) {
        str = strList[i];
        if (this.isEmpty(str)) {
            hasEmpty = true;
            break;
        }
    }
    return hasEmpty;
}

/**
 * 判断传入字符串参数列表全部项是否都为null或者undefined
 * @param ...strList 字符串列表
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.isEmptyEvery(str1,str2) //---> true
 */
StringLibraryClass.prototype.isEmptyEvery = function(s, s1, s2) {
    var str = null;
    var hasEmptyAll = true;
    var strList = this.argumentsArray(arguments);
    for (var i = 0, k = strList.length; i < k; i++) {
        str = strList[i];
        if (!this.isEmpty(str)) {
            hasEmptyAll = false;
            break;
        }
    }
    return hasEmptyAll;
}

/**
 * 判断指定值是否为null,undefined或者空字符串或者包含空格
 * @param s 字符串
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.isBlank(str);
 */
StringLibraryClass.prototype.isBlank = function(s) {
    if (this.isEmpty(s)) {
        return true;
    } else {
        return this.trimAll(s.toString()) === '';
    }
}

/**
 * 判断传入字符串参数列表是否存在一项为null,undefined或者空字符串或者包含空格
 * @param ...strList 字符串列表
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.isBlankAny(str,str1,str2)
 */
StringLibraryClass.prototype.isBlankAny = function(s, s1, s2) {
    var str = null;
    var hasBlankOne = false;
    var strList = this.argumentsArray(arguments);
    for (var i = 0, k = strList.length; i < k; i++) {
        str = strList[i];
        if (this.isBlank(str)) {
            hasBlankOne = true;
            break;
        }
    }
    return hasBlankOne;
}

/**
 * 判断传入字符串参数列表是所有项都为null,undefined或者空字符串或者包含空格
 * @param ...strList 字符串列表
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.isBlankAny(str1,str2,str3)
 */
StringLibraryClass.prototype.isBlankEvery = function(s, s1, s2) {
    var str = null;
    var hasBlankAll = true;
    var strList = this.argumentsArray(arguments);
    for (var i = 0, k = strList.length; i < k; i++) {
        str = strList[i];
        if (!this.isBlank(str)) {
            hasBlankAll = false;
            break;
        }
    }
    return hasBlankAll;
}

/**
 * 如果传入值为null或者undefined时，使用指定默认值
 * @param v 传入值
 * @param dv 替代字符串
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.emptyOf(str,'12') //---> '12'
 */
StringLibraryClass.prototype.emptyOf = function(v, dv) {
    return this.isEmpty(v) ? dv : v;
}

/**
 * 如果传入值为null或者undefined或者空字符串以及多个空格时，使用指定默认值
 * @param v 传入值
 * @param dv 替代字符串
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.blankOf(str,'12');
 */
StringLibraryClass.prototype.blankOf = function(v, dv) {
    return this.isBlank(v) ? dv : v;
}

/**
 * 比较连个字符串是否相等
 * @param a 字符串1
 * @param b 字符串2
 * @param ignore 是否忽略大小写
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.equals(str,str2);
 */
StringLibraryClass.prototype.equals = function(a, b, ignore) {
    if (ignore === true) {
        return (a || '').toString().toLowerCase() === (b || '').toString().toLowerCase();
    } else {
        return a === b;
    }
}

/**
 * 14.判断传入值是否为String类型
 * @param v 字符串
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.isString(str);
 */
StringLibraryClass.prototype.isString = function(v) {
    return Type.isString.apply(Type, arguments);
}

/**
 * 重复指定字符
 * @param chars 要重复的字符串
 * @param num 重复次数
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.repeat('a',2); // > 'aa'
 */
StringLibraryClass.prototype.repeat = function(chars, num) {
    var tmp = chars;
    if (this.isEmpty(tmp) || !Type.isNumber(num) || num <= 0) {
        return null;
    } else if (num == 1) {
        return tmp;
    }
    for (var i = 0, k = num - 1; i < k; i++) {
        chars = chars + tmp;
    }
    return chars;
}

/**
 * 在不满足指定长度的情况下，自动从两侧补全字符串
 * @param chars 字符串
 * @param length 长度
 * @param padding 补全的字符 例如： 'a' 默认:' '
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.pad('12',5); //> '  12 '
 *          Dante.String.pad('12',5,'-'); //> '--12-'    
 */
StringLibraryClass.prototype.pad = function(chars, length, padding) {
    chars = this.ensure(chars);
    var mlen = length - chars.length;
    var left = Math.ceil(mlen / 2);
    var right = mlen - left;
    padding = this.ensure(padding, ' ');
    if (mlen <= 0) {
        return chars;
    }
    return this.repeat(padding, left) + chars + this.repeat(padding, right);
}


/**
 * 在不满足指定长度的情况下，自动补全左侧字符
 * @param chars 字符串
 * @param length 数字字符串
 * @param padding 补全的字符 例如： 'a' 默认:' '
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.padLeft('aa',4); //> '  aa'
 *          Dante.String.padLeft('aa',4,'0'); //> '00aa'
 */
StringLibraryClass.prototype.padLeft = function(chars, length, padding) {
    chars = this.ensure(chars);
    padding = this.ensure(padding, ' ');
    var mlen = length - chars.length;
    if (mlen > 0) {
        chars = this.repeat(padding, mlen) + chars;
    }
    return chars;
}

/**
 * 在不满足指定长度的情况下，自动补全右侧字符
 * @param chars 字符串
 * @param length 数字字符串
 * @param padding 补全的字符 例如： 'a' 默认:' '
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.padRight('aa',4); //> 'aa  '
 *          Dante.String.padRight('aa',4,'0'); //> 'aa00'
 */
StringLibraryClass.prototype.padRight = function(chars, length, padding) {
    chars = this.ensure(chars);
    padding = this.ensure(padding, ' ');
    var mlen = length - chars.length;
    if (mlen > 0) {
        chars = chars + this.repeat(padding, mlen);
    }
    return chars;
}

/**
 * 替换指定字符串指定内容
 * @param str 原始字符串
 * @param origin 要替换的字符串 可以为正则
 * @param rep 替换成字符串
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.replace('aabevenaahello','aa'); //> 'bevenhello'
 *          Dante.String.replace('aabevenaahello','aa','bb'); //> 'bbbevenbbhello'
 */
StringLibraryClass.prototype.replace = function(str, origin, rep) {
    str = this.ensure(str);
    rep = this.ensure(rep, '');
    if (this.isBlank(origin) || this.equals(origin, rep)) {
        return str;
    } else {
        return str.replace(new RegExp(origin, 'g'), rep);
    }
}


/**
 * 确定字符串以 xx(chars) 开头，如果不是则默认拼接至开头
 * @param str 原始字符串
 * @param chars 开头字符串
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.ensureStartsWith('beven','aa'); //> 'aabeven'
 *          Dante.String.ensureStartsWith('aabeven','aa'); //> 'aabeven'
 */
StringLibraryClass.prototype.ensureStartsWith = function(str, chars) {
    return this.startsWith(str, chars) ? str : this.ensure(chars) + str;
}

/**
 * 确定字符串以 xx(chars) 结尾，如果不是则默认拼接至结尾
 * @param str 原始字符串
 * @param chars 结尾字符串
 * 
 * @example
 *          var Dante = require('dantejs');
 *          Dante.String.ensureEndsWith('beven','aa'); //> 'bevenaa'
 *          Dante.String.ensureEndsWith('bevenaa','aa'); //> 'bevenaa'
 */
StringLibraryClass.prototype.ensureEndsWith = function(str, chars) {
    return this.endsWith(str, chars) ? str : str + this.ensure(chars);
}

/**
 * 将字符串转换成首字母大写
 */
StringLibraryClass.prototype.toCamel = function(str){
    str = this.ensure(str);
    return str[0].toUpperCase() + (str.substr(1)||'');
}

//引用附加
module.exports = new StringLibraryClass();