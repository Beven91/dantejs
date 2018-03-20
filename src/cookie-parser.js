/*****************************************************************
 * 名称：用于解析document.cookie字符串的工具
 * 日期：2015-02-19
 * 版本：0.0.1
 * 描述：无
 ****************************************************************/
var Base = require('./base.js');
var Type = require('./type.js');
var Strings = require('./string.js');
var Arrays = require('./array.js');

/**
 * @module CookieParser 
 */

/** 
 * Cookie解析构造函数
 * @constructor
 */
function CookieParser(encode) {
    this.encode = encode !==false;
    initParser.apply(this, arguments);
}

//继承于基础类
Base.driver(CookieParser);

/**
 * 名称：根据传入名称获取指定cookie的值
 * @param name cookie名称（可不区分大小写)
 */
CookieParser.prototype.getCookie = function(name) {
    name = (name || '').toString().toLowerCase();
    return this.__cookies[name];
}

/**
 * 清除指定cookie
 */
CookieParser.prototype.removeCookie = function(name, path) {
    this.setCookie(name, "", -1, path);
}

/**
 * 名称：设置一个cookie
 * @param name cookie 名称
 * @param v cookie 对应的值
 * @param expires 过期时间 可以是一个date类型，或者date类型的字符串
 * @param path cookie路径
 */
CookieParser.prototype.setCookie = function(name, v, expires, path) {
    if (Strings.isBlank(name)) {
        return;
    }
    if (Type.isDate(expires)) {
        expires = expires.toGMTString();
    }
    name = Strings.trim(name)
    var cv = this.encode ? encodeURI(v):v;
    if(expires){
      window.document.cookie = Strings.format("{0}={1};expires={2};path={3}", name, cv, expires, (path || ""));
    }else{
      window.document.cookie = Strings.format("{0}={1};path={2}", name, cv, (path || ""));
    }
    this[name] = v;
    this.__cookies[name.toLowerCase()] = v;
}

CookieParser.prototype.parse = function(cookie) {
    InitParser.apply(this, cookie);
}

CookieParser.cookieKeyValues = function(cookies) {
    cookies = Arrays.ensureArray(cookies);
    var commonCookies = [];
    var cstr = null;
    for (var i = 0, k = cookies.length; i < k; i++) {
        cstr = cookies[i];
        commonCookies.push(cstr.split(';')[0]);
    }
    return commonCookies;
}

/**
 * 名称：初始化解析器
 */
function initParser(docOrCookie) {
    this.__cookies = {};
    if (docOrCookie == null) {
        return;
    }
    var cookie = null;
    if (Type.isString(docOrCookie)) {
        cookie = docOrCookie;
    } else {
        cookie = docOrCookie.cookie;
    }
    cookie = cookie || '';
    var kv = null,
        name = null,
        v = null;
    var cookieKvs = cookie.split(';');
    var cookies = {};
    for (var i = 0, k = cookieKvs.length; i < k; i++) {
        kv = cookieKvs[i].split('=');
        name = Strings.trim(kv.shift());
        v = (trimQuotCookieParamValue(kv.join('=')));
        v = this.encode ? decodeURI(v):v;
        cookies[name.toLowerCase()] = v;
        if (Strings.isBlank(v)) {
            continue;
        }
        this[name] = v;
    }
    this.__cookies = cookies || {};
}

/**
 * 格式化cookie参数值
 */
function trimQuotCookieParamValue(v) {
    v = Strings.trimLeft(v, "\"");
    v = Strings.trimRight(v, "\"");
    return v;
}

module.exports = CookieParser;