/*******************************************************
 * 名称：链尚网主框架库文件：客户端浏览器Url解析器
 * 日期：2015-07-15
 * 版本：0.0.1
 * 描述：解析指定URL地址
 *       解析部分包含：协议，域名，访问路径，访问Get参数
 *       例如：http://www.lianshang.cn/orders?id=1&productid=2333
 *       解析结构类似：{protocol:'http:',host:'www.lianshang.cn',pathname:'/orders',paras:{id:1,productid:23333} }
 *******************************************************/
var Base = require('../base/base.js');
var Type = require('../base/type.js');
var Strings = require('../base/string.js');
var Arrays = require('../base/array.js');

/**
 * @module UrlParser 
 */

/** 
 * 名称：URL解析工具构造函数
 */
function UrlParserLibraryClass(url) {
    this.parse(url);
}

//继承于基础类
Base.driver(UrlParserLibraryClass);

/**
 * 名称：解析指定url
 */
UrlParserLibraryClass.prototype.parse = function(url) {
    var parts = (url || '').toString().split('#');
    url = parts[0] || "";
    var kvs = url.split('?');
    url = kvs.shift();
    var queryParams = kvs.join('?');
    var fragments = url.match(/((\w+\:)|\/\/)\/\/(([\w,\-]+(\.|))+)(:\d+|)((\/.+)|)/) || [];
    var attributes = ['href', 'protocol',null,'host', null, null, 'port', 'pathname'];
    var attr = null;
    for (var i = 0, k = attributes.length; i < k; i++) {
        attr = attributes[i];
        if (attr) {
            this[attr] = fragments[i] || "";
        }
    }
    if (fragments.length < 1) {
        this.pathname = url;
    }
    this.hash = parts[1]||"";
    this.url = (url);
    this.port = this.port.replace(":", "");
    var kv = (this.pathname || "").split('?');

    this.search = queryParams || "";
    this.pathname = kv[0];
    this.parseParams(this.search);
}

/**
 * 名称：解析get参数
 */
UrlParserLibraryClass.prototype.parseParams = function(search) {
    search = (search || "");
    search = Strings.trimLeft(search, "\\?");
    var kvs = search.split('&');
    var kv = null,
        paras = {};
    for (var i = 0, k = kvs.length; i < k; i++) {
        kv = kvs[i];
        if (kv === '') {
            continue;
        }
        kv = kv.split('=');
        paras[decodeURIComponent(kv.shift())] = decodeURIComponent(kv.join('=') || "");
    }
    this.paras = paras;
    return this;
}

/**
 * 名称：直接绑定当前window.location
 */
UrlParserLibraryClass.prototype.bind = function() {
    var attributes = ['href', 'protocol', 'host', 'port', 'search', 'pathname'];
    var attr = null,
        location = window.location;
    for (var i = 0, k = attributes.length; i < k; i++) {
        attr = attributes[i];
        if (attr) {
            this[attr] = location[attr];
        }
    }
    this.parseParams(this.search);
    return this;
}

/**
 * 名称：将当前解析器的参数转换成url参数形式
 */
UrlParserLibraryClass.prototype.toParamString = function(ignoreEmpty) {
    var paras = this.paras || {};
    var strArray = [];
    for (var i in paras) {
        if (ignoreEmpty === true && Strings.isBlank(paras[i])) {
            continue;
        }
        strArray.push(i + '=' + paras[i]);
    }
    return '?' + strArray.join('&');
}

/**
 * 名称：重写toString方法
 */
UrlParserLibraryClass.prototype.toString = function(ignoreEmpty) {
    var port = "";
    if (!Strings.isBlank(this.port)) {
        port = ":" + this.port;
    }
    var hash = Strings.isBlank(this.hash)?'':'#'+this.hash;
    var sp = this.protocol ? "//" : "";
    return Strings.format("{0}{1}{2}{3}{4}{5}{6}", this.protocol, sp, this.host, port, this.pathname, this.toParamString(ignoreEmpty),hash);
}

//引用附加
module.exports = UrlParserLibraryClass;