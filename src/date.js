/***************************************************
 * 链尚网通用库文件：时间操作工具
 * 日期：2016-10-27
 * 描述：提供相关时间操作函数
 * ************************************************/
var Base = require('./base.js');
var Type = require('./type.js');

var zhWeeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

/**
 * @module Date
 */

/**
 * 时间辅助函数操作函数类
 */
function DateLibraryClass() {}

//继承于基础类
Base.driver(DateLibraryClass);

/**
 * 将指定时间转换成指定格式的字符串格式
 * @param   date 可以是Date对象，或者时间格式的字符串
 * @param   fmt  格式单位(fmt) 例如： yyyy-MM-dd hh:mm:S.S
 * 
 * @example 
 *          var Dante = require('dantejs');
 *          Dante.Date.format(new Date(),'yyyy-MM-dd hh:mm:S.S')
 * 
 */
DateLibraryClass.prototype.format = function(date, fmt) {
    date = this.convert(date);
    var o = [
        fmt,
        date.getFullYear(),
        date.getMonth() + 1, //月份 "M+": 
        date.getDate(), //日
        date.getHours(), //小时
        date.getMinutes(), //分钟
        date.getSeconds(), //秒
        date.getMilliseconds(), //毫秒
        Math.floor((date.getMonth() + 3) / 3) //季节

    ];
    return format.apply(this, o);
}

/**
 * 判断传入值是否为Date数据类型
 * @param date  待判断的值
 * 
 * @example 
 *         var Dante = require('dantejs');
 *         Dante.Date.isDate(''); //> false
 *         Dante.Date.isDate(new Date()); //> true
 */
DateLibraryClass.prototype.isDate = function(date) {
    return Type.isDate(date);
}

/**
 * 时间转换函数
 * @param   maybe 时间类型，或者时间类型字符串，或者毫秒数字
 * 
 * @example 
 *         var Dante = require('dantejs');
 *         Dante.Date.convert('2016-10-22'); > Date()
 */
DateLibraryClass.prototype.convert = function(maybe) {
    if (this.isDate(maybe)) {
        return maybe;
    } else if (Type.isString(maybe) && isNaN(maybe)) {
        maybe = maybe.replace(/-/g, '/');
        var values = maybe.match(/(\d+)+/g);
        return (new Date(values[0], parseInt(values[1]) - 1, (values[2] || ''), (values[3] || ''), (values[4] || ''), (values[5] || ''), (values[6] || '')));
    } else {
        return new Date(Number(maybe));
    }
}

/**
 * 计算两个时间之间的差值
 * @param  dtStart  开始日期 可以是一个时间类型或者一个时间格式的字符串
 * @param  dtEnd.   开始日期 可以是一个时间类型或者一个时间格式的字符串
 * @param  unit     单位： S(毫秒) s(秒) m(分) h(小时) d(天) M(月) y(年)
 * 
 * @example 
 *         var Dante = require('dantejs');
 *         Dante.Date.diff('2016-10-22','2016-10-01','d'); >21
 */
DateLibraryClass.prototype.diff = function(dtStart, dtEnd, unit) {
    dtStart = this.convert(dtStart);
    dtEnd = this.convert(dtEnd);
    var v = 0;
    switch (unit) {
        case 'S':
            v = dtEnd.getTime() - dtStart.getTime();
            break;
        case 's':
            v = (dtEnd.getTime() - dtStart.getTime()) / 1000;
            break;
        case 'm':
            v = (dtEnd.getTime() - dtStart.getTime()) / 60000;
            break;
        case 'h':
            v = (dtEnd.getTime() - dtStart.getTime()) / 3600000;
            break;
        case 'd':
            v = (dtEnd.getTime() - dtStart.getTime()) / 86400000;
            break;
        case 'M':
            v = ((dtEnd.getMonth() + 1) + (dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
            break;
        case 'y':
            v = (dtEnd.getFullYear() - dtStart.getFullYear());
            break;
        default:
            v = 0;
            break;
    }
    return parseInt(v);
}

/**
 * 增加添加指定单位的时间值
 * @param   dt   日期 可以是一个时间类型或者一个时间格式的字符串
 * @param   num  时间隔值
 * @param   unit 时间间隔单位： S(毫秒) s(秒) m(分) h(小时) d(天) M(月) y(年)
 */
DateLibraryClass.prototype.dateAdd = function(dt, num, unit) {
    dt = this.convert(dt);
    switch (unit) {
        case 'S':
            return new Date(dt.getTime() + num);
        case 's':
            return new Date(dt.getTime() + num * 1000);
        case 'm':
            return new Date(dt.getTime() + num * 60000);
        case 'h':
            return new Date(dt.getTime() + num * 3600000);
        case 'd':
            return new Date(dt.getTime() + num * 86400000);
        case 'M':
            return new Date(dt.getFullYear(), (dt.getMonth() + num), dt.getDate(), dt.getHours(), dt.getSeconds(), dt.getMilliseconds());
        case 'y':
            return new Date(dt.getFullYear() + num, dt.getMonth(), dt.getDate(), dt.getHours(), dt.getSeconds(), dt.getMilliseconds());
        default:
            return dt;
    }
}

/**
 * 给指定时间累加毫秒
 * @param dt 待累加毫秒的时间类型数据(可以是时间类型数据或者时间格式的字符串)
 * @param milliSeconds 累加毫秒
 */
DateLibraryClass.prototype.addMilliseconds = function(dt, milliSeconds) {
    return this.dateAdd(dt, milliSeconds, 'S');
}

/**
 * 给指定时间累加秒
 * @param dt):待累加秒的时间
 * @param seconds):累加秒
 */
DateLibraryClass.prototype.addSeconds = function(dt, seconds) {
    return this.dateAdd(dt, seconds, 's');
}

/**
 * 给指定时间累加分钟
 * @param dt):待累加分钟的时间(可以是时间类型数据或者时间格式的字符串)
 * @param minutes):累加分钟
 */
DateLibraryClass.prototype.addMinutes = function(dt, minutes) {
    return this.dateAdd(dt, minutes, 'm');
}

/**
 * 给指定时间累加小时
 * @param dt):待累加小时的时间(可以是时间类型数据或者时间格式的字符串)
 * @param hours):累加小时
 */
DateLibraryClass.prototype.addHours = function(dt, hours) {
    return this.dateAdd(dt, hours, 'h');
}

/**
 * 给指定时间累加天数
 * @param dt):待累加天数的时间(可以是时间类型数据或者时间格式的字符串)
 * @param days):累加天数
 */
DateLibraryClass.prototype.addDays = function(dt, days) {
    return this.dateAdd(dt, days, 'd');
}

/**
 * 给指定时间累加月
 * @param dt):待累加月的时间(可以是时间类型数据或者时间格式的字符串)
 * @param months):累加月
 */
DateLibraryClass.prototype.addMonths = function(dt, months) {
    return this.dateAdd(dt, months, 'M');
}

/**
 * 给指定时间累加年
 * @param dt):待累加年的时间(可以是时间类型数据或者时间格式的字符串)
 * @param years):累加年
 */
DateLibraryClass.prototype.addYears = function(dt, years) {
    return this.dateAdd(dt, years, 'y');
}

/**
 * 获取当前日期所在月的最大天数
 * @param dt):时间类型或者可以是一个时间格式的字符串
 */
DateLibraryClass.prototype.maxDayOfMonth = function(dt) {
    dt = this.convert(dt);
    var dt2 = this.addMonths(dt, 1);
    return this.diff(dt, dt2, 'd');
}

/**
 * 获取当前传入时间天所在汉字星期值
 * @param dt 传入时间类型或者时间类型格式的字符串
 */
DateLibraryClass.prototype.dayOfWeek = function(dt) {
    dt = this.convert(dt);
    return zhWeeks[dt.getDay()];
}

/**
 * 克隆传入时间
 * @param dt 时间类型变量或者时间格式的字符串
 */
DateLibraryClass.prototype.clone = function(dt) {
    dt = this.convert(dt);
    return new Date(dt.getTime());
}

/**
 * 判断传入日期是否为闰年
 * @param date
 * 
 * @example 
 *          var Dante = require('dantejs');
 *          Dante.isLeapYear('2004-10-22 10:22');
 */
DateLibraryClass.prototype.isLeapYear = function(date) {
    var year = this.datePart(date, 'y');
    return (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0));
}

/**
 * 获取当前传入时间的单位部分值
 * @param   dt 时间类型或者时间类型格式字符串
 * @param   part  时间间隔单位： S(毫秒) s(秒) m(分) h(小时) d(天) m(月) y(年) w(星期值)
 * 
 * @example 
 *          var Dante = require('dantejs');
 *          Dante.DatePart('2004-10-22 10:22','y'); > 2004
 */
DateLibraryClass.prototype.datePart = function(dt, part) {
    dt = this.convert(dt);
    switch (part) {
        case 'S':
            return dt.getMilliseconds();
        case 's':
            return dt.getSeconds();
        case 'm':
            return dt.getMinutes();
        case 'h':
            return dt.getHours();
        case 'd':
            return dt.getDate();
        case 'M':
            return dt.getMonth() + 1;
        case 'y':
            return dt.getFullYear();
        case 'w':
            return dt.getDay();
        default:
            return null;
    }
}

/**
 * 获取当前日期所在年的第多少天
 * @param   dt 时间类型或者为时间类型格式的字符串
 * @example 
 *          var Dante = require('dantejs');
 *          Dante.daysInYear('2015-04-23 12:00:00'); > 113
 */
DateLibraryClass.prototype.daysInYear = function(dt) {
    dt = this.convert(dt);
    var dtFirst = new Date(dt.getFullYear(), 0, 0, 0, 0, 0);
    return this.diff(dtFirst, dt, 'd');
}

/**
 * 获取当前日期所在年的第几周
 * @param   dt 时间类型或者为时间类型格式的字符串
 * @example 
 *          var Dante = require('dantejs');
 *          Dante.weeksInYears('2015-01-23 12:00:00'); > 4
 */
DateLibraryClass.prototype.weeksInYears = function(dt) {
    dt = this.convert(dt);
    var dtFirst = new Date(dt.getFullYear(), 0, 0, 0, 0, 0);
    var week = dtFirst.getDay();
    week = week === 0 ? 7 : week;
    dtFirst = this.addDays(dtFirst, 7 - week);
    var days = this.diff(dtFirst, dt, 'd');
    var weeks = parseInt(days / 7);
    if (days % 7 !== 0) {
        weeks = weeks + 1;
    }
    return weeks + 1;
}

/**
 * 名称:将当前日志转换成unix的时间戳 ..
 * @param   date 日期
 * @example 
 *          var Dante = require('dantejs');
 *          Dante.toUnixTimeStamp('2015-01-23 12:00:00'); > 1421985600
 */
DateLibraryClass.prototype.toUnixTimeStamp = function(date) {
    date = this.convert(date);
    return Math.round(date.getTime() / 1000);
}

/**
 * 名称:将unix时间戳转换成date类型
 * @param   timestamp 时间戳字符串
 * @example 
 *          var Dante = require('dantejs');
 *          Dante.unixTimeStampToDate(1421985600); > '2015-01-23 12:00:00'
 */
DateLibraryClass.prototype.unixTimeStampToDate = function(timestamp) {
    var number = timestamp || 0;
    return new Date(number * 1000);
}

/**
 * 名称:将毫秒转换成 总计多少小时 多少分钟 多少秒
 * @param   milliSeconds 毫秒值
 */
DateLibraryClass.prototype.countHour = function(milliSeconds) {
    var hour = parseInt(milliSeconds / 1000 / 60 / 60, 10);
    var minutes = parseInt(milliSeconds / 1000 / 60 % 60, 10);
    var seconds = parseInt(milliSeconds / 1000 % 60);
    return format('hh:mm:S', 0, 0, 0, hour, minutes, seconds, 0, 0);
}

/**
 * 名称:将毫秒转换成 总计多少天 多少小时 多少分钟 多少秒
 * @param   milliSeconds 毫秒值
 */
DateLibraryClass.prototype.countDays = function(milliSeconds) {
    var days = parseInt(milliSeconds / 1000 / 60 / 60 / 24, 10);
    var hour = parseInt(milliSeconds / 1000 / 60 / 60 % 24, 10);
    var minutes = parseInt(milliSeconds / 1000 / 60 % 60, 10);
    var seconds = parseInt(milliSeconds / 1000 % 60);
    return format('dd天hh:mm:S', 0, 0, days, hour, minutes, seconds, 0, 0);
}

function format(fmt, y, M, d, h, m, s, S, q) {
    var o = {
        "M+": M,
        //月份
        "d+": d,
        //日
        "h+": (h > 12 ? h - 12 : h),
        "H+": h,
        //小时
        "m+": m,
        //分
        "s+": s,
        //秒
        "q+": q,
        //季度
        "S": S //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (y + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

//附加引用
module.exports = new DateLibraryClass();