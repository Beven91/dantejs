/*******************************************************
 * 名称：链尚网主框架库文件：判断当前浏览器类型以及版本的探测工具
 * 日期：2015-07-29
 * 版本：0.0.1
 * 描述：判断当前浏览器类型以及版本的探测工具
 *******************************************************/
var Base = require('./base.js');

var inNavigator = {};

if (typeof window == 'object') {
    inNavigator = navigator || {};
}

/**
 * @module Browser 
 */

/** 
 * 名称：浏览器探测工具构造函数
 */
function BrowserTypeVersionClass() {}

/**
 * 名称：设配探测结果构造函数
 */
function App(handler) {
    if (handler) {
        var info = handler((inNavigator.userAgent || "")) || {};
        this.matched = info.matched;
        this.version = info.version;
        this.name = info.name;
    }
}

//继承于基础类
Base.driver(BrowserTypeVersionClass);

//浏览器类型
App.prototype.name = null;

//浏览器版本号
App.prototype.version = null;

//当前结果是否能匹配当前浏览器
App.prototype.matched = false;

//当前匹配成功的app
var currentApp = null;

/**
 * 名称：获取当前浏览器的信息
 */
BrowserTypeVersionClass.prototype.getCurrent = function() {
    if (currentApp) {
        return {
            name: currentApp.name,
            version: currentApp.version,
            equipment: mobileOf(),
            os: systemOf()
        };
    } else {
        return {
            name: 'unknow',
            version: 'nuknow',
            equipment: 'unknow'
        }
    }
}

/**
 * 名称：获取当前浏览器简写
 */
BrowserTypeVersionClass.prototype.getClassName = function() {
    var app = this.getCurrent();
    var nameList = [];
    nameList.push(app.name);
    nameList.push(app.name + "_" + parseInt(app.version));
    nameList.push(app.name + "_" + (app.version || '').replace(/\./g, '_'));
    return nameList.join(' ').toLowerCase();
}

/**
 * 名称:判断是否为移动端,或者为移动端指定操作系统
 * @param  sys (ios | android )
 */
BrowserTypeVersionClass.prototype.mobile = function(sys) {
    if (arguments.length === 0) {
        return inNavigator.userAgent.match(/AppleWebKit.*Mobile.*/);
    } else {
        return mobileOf() === sys;
    }
}

/**
 * 名称:获取或者比较当前操作系统
 * @param os 操作系统类型 可以比较: windows,mac,unix,linux,ios,android或者其他
 *          注意:如果不填写此值,则默认返回当前操作系统信息
 */
BrowserTypeVersionClass.prototype.os = function(os) {
    if (arguments.length === 1) {
        return systemOf().type == os;
    } else {
        return systemOf();
    }
}

/**
 * 名称：添加一个浏览器类型探测
 * @param name 浏览器名称 例如: ie
 * @param handler 检测函数 例如：function(){  return {version:'',matched:(true/false)} }
 */
function add(name, handler) {
    if (currentApp) {
        handler = null;
    }
    var app = new App(handler);
    if (app.matched) {
        currentApp = app;
    }
    BrowserTypeVersionClass.prototype[name] = function(eq, version) {
        if (arguments.length == 1) {
            version = eq;
            return app.matched && version === app.version;
        } else if (arguments.length > 1) {
            return app.matched && expressVersion(version, app.version, eq);
        } else {
            return app.matched;
        }
    }
}

//firefox浏览器
add('firefox', firefox);
//ie浏览器
add('ie', ie);
//opera浏览器
add('opera', opera);
//Chrome浏览器
add('chrome', chrome);
//safari 浏览器
add('safari', safari);

//ie浏览器
function ie(userAgent) {
    var values = userAgent.match(/MSIE\s(\d+\.\d+)/);
    if (values === null) {
        values = userAgent.match(/rv:(\d+\.\d+)/);
    }
    return infoVersion('MSIE', values);
}

//火狐浏览器
function firefox(userAgent) {
    return infoVersion('Firefox', userAgent.match(/Firefox\/(\d+(\.|\d)+)/))
}

//Opera浏览器
function opera(userAgent) {
    return infoVersion('Opera', userAgent.match(/OPR\/(\d+(\.|\d)+)/));
}

//Safari浏览器
function safari(userAgent) {
    return infoVersion('Safari', userAgent.match(/Safari\/(\d+(\.|\d)+)/));
}

//Chrome浏览器
function chrome(userAgent) {
    return infoVersion('Chrome', userAgent.match(/Chrome\/(\d+(\.|\d)+)/));
}

//返回浏览器信息
function infoVersion(name, values) {
    var version = values !== null ? values[1] : null;
    return {
        version: version,
        name: name,
        matched: values !== null
    }
}

/**
 * 动态 比较版本号
 */
function expressVersion(version, currentVersion, eq) {
    version = core.utils.ensureDecimal(version, -99);
    currentVersion = core.utils.ensureDecimal(currentVersion, -100);
    eq = core.utils.undef(eq, '==');
    var v = false;
    switch (eq) {
        case '>':
            v = currentVersion > version;
            break;
        case '<':
            v = currentVersion < version;
            break;
        case '>=':
            v = currentVersion >= version;
            break;
        case '<=':
            v = currentVersion <= version;
            break;
        default:
            v = currentVersion === version;
            break;
    }
    return v;
}

/**
 * 获取设备类型
 */
function deviceTypeOf() {
    var ua = inNavigator.userAgent;
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    if (ipad) {
        return {
            name: 'ipad',
            title: '平板'
        };
    } else if (ua.match(/AppleWebKit.*Mobile.*/)) {
        return {
            name: 'phone',
            title: '手机'
        };
    } else {
        return {
            name: 'pc',
            title: '电脑'
        };
    }
}

/**
 * 获取手机操作系统类型
 */
function mobileOf() {
    var userAgent = inNavigator.userAgent;
    if (!userAgent.match(/AppleWebKit.*Mobile.*/)) {
        return 'pc';
    }
    if (userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        return 'ios';
    } else if (userAgent.indexOf('Android') > -1) {
        return 'android';
    } else {
        return 'other';
    }
}

/**
 * 获取当前操作系统信息
 */
function systemOf() {
    var userAgent = inNavigator.userAgent;
    var osVersion = (userAgent.split(';')[0] || '').split('(')[1];
    var os = null;
    if (!userAgent.match(/AppleWebKit.*Mobile.*/)) {
        os = pcSystemOf(osVersion);
    } else if (userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        os = {
            name: 'ios',
            version: osVersion,
            type: 'ios'
        };
    } else if (userAgent.indexOf('Android') > -1) {
        os = {
            name: 'android',
            version: osVersion,
            type: 'android'
        };
    } else {
        os = {
            name: 'other',
            version: osVersion,
            type: 'other'
        };
    }
    os.device = deviceTypeOf();
    return os;
}

/**
 * pc操作系统获取
 * @param osVersion
 * @returns {*}
 */
function pcSystemOf(osVersion) {
    var platform = inNavigator.platform;
    if (platform == "Win32" || platform == "Windows") {
        return {
            name: windowsOf(osVersion),
            version: osVersion,
            type: 'windows'
        }
    } else if (platform == "Mac68K" || platform == "Macintosh" || platform == "MacPPC") {
        return {
            name: 'Mac',
            version: osVersion,
            type: 'mac'
        }
    } else if (platform == "X11") {
        return {
            name: 'Unix',
            version: osVersion,
            type: 'unix'
        }
    } else if (platform == "Linux") {
        return {
            name: "Linux",
            version: osVersion,
            type: 'linux'
        }
    } else {
        return {
            name: platform,
            version: osVersion,
            type: platform
        };
    }
}

function windowsOf(osVersion) {
    if (osVersion.indexOf("Windows NT 5.0") > -1 || osVersion.indexOf("Windows 2000") > -1) {
        return "Win2000";
    } else if (osVersion.indexOf("Windows NT 5.1") > -1 || osVersion.indexOf("Windows XP") > -1) {
        return "WinXP";
    } else if (osVersion.indexOf("Windows NT 5.2") > -1 || osVersion.indexOf("Windows 2003") > -1) {
        return "Win2003";
    } else if (osVersion.indexOf("Windows NT 6.0") > -1 || osVersion.indexOf("Windows Vista") > -1) {
        return "WinVista";
    } else if (osVersion.indexOf("Windows NT 6.1") > -1 || osVersion.indexOf("Windows 7") > -1) {
        return "Win7";
    } else if (osVersion.indexOf("Windows NT 6.2") > -1 || osVersion.indexOf("Windows 8") > -1) {
        return "win8";
    } else if (osVersion.indexOf("Windows NT 6.3") > -1 || osVersion.indexOf("Windows 8.1") > -1) {
        return "win8.1"
    } else if (osVersion.indexOf("Windows NT 6.4") || osVersion.indexOf("Windows NT 10.0") > -1 || osVersion.indexOf("Windows 10") > -1) {
        return "win10";
    } else {
        return osVersion;
    }
}

module.exports = BrowserTypeVersionClass;