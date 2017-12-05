/*******************************************************
 * 名称：链尚网主框架库文件：数据规则校验器
 * 日期：2015-07-15
 * 版本：0.0.1
 * 描述：主要提供字符串的相关操作函数，提高开发效率
 *******************************************************/
var Base = require('../base/base.js');
var Type = require('../base/type.js');
var Strings = require('../base/string.js');
var Arrays = require('../base/array.js');
var EventEmitter = require('./emitter.js');

/**
 * @module Validator 
 */

/** 
 * 名称：通用方法工具类
 */
function ValidatorLibraryClass() {
    this.emitter = new EventEmitter();
    this.emitter.validator = this;
}

//继承于基础类
Base.driver(ValidatorLibraryClass);

//添加全局静态实例
ValidatorLibraryClass.validator = new ValidatorLibraryClass();

/**
 * 注册一个规则
 * @param name 校验器名称
 * @param handler 校验器函数 返回 true/false
 * @param defaultMessage 验证失败消息
 */
ValidatorLibraryClass.registerRule = function(name, handler, defaultMessage) {
    var p = ValidatorLibraryClass.prototype;
    if (name in p) {
        throw new Error(Strings.format('已存在名称为{0}的校验器', name));
    }
    if (!Type.isFunction(handler)) {
        throw new Error("检验器必须为一个function")
    }
    p[name] = function(value, parasOne, parasN, model) {
        var r = handler.apply(this, arguments);
        //消息为默认第倒数二个参数，最后一个参数为框架注入de
        var message = arguments[arguments.length - 2];
        var args = this.argumentsArray(arguments);
        var params = args.slice(1, arguments.length - 1)
        return traslate(this.emitter, r, message, defaultMessage, params, value);
    }
}


/**
 * 绑定一个invalid事件
 */
ValidatorLibraryClass.prototype.onInvalid = function(handler) {
    this.emitter.on('invalid', handler);
}

/**
 * 绑定一个valid事件
 */
ValidatorLibraryClass.prototype.onValid = function(handler) {
    this.emitter.on('valid', handler);
}

/**
 * 清空绑定的invalid事件
 */
ValidatorLibraryClass.prototype.clear = function() {
    this.emitter.off();
}

/**
 * 校验指定model
 * @param model object对象
 * @param cfg 配置对象
 * @param slient 是否 为静默模式 如果为true 则不触发onInvalid与inValid事件 错误消息可以从currentMessage中取出
 */
ValidatorLibraryClass.prototype.model = function(model, cfg, slient) {
    this.currentFormName = null;
    if (!Type.isNnObject(model)) {
        throw new Error('model参数必须为不为null的object对象');
    }
    if (!Type.isObject(model)) {
        throw new Error("参数cfg 必须设置")
    }
    this.slient = slient;
    var keys = this.getKeys(cfg);
    var r = keys.length < 1,
        keyName;
    for (var i = 0, k = keys.length; i < k; i++) {
        keyName = keys[i];
        r = this.attr(keyName, model[keyName], cfg, model);
        if (!r) {
            break;
        }
    }
    if (r) {
        this.currentFormName = null;
    }
    return r;
}

/**
 * 使用指定验证配置对象验证指定model指定属性
 * @param name 验证属性名称
 * @param value 属性值
 * @param cfg 验证配置对象
 * @parma model 上下文对象 可以不填写
 */
ValidatorLibraryClass.prototype.attr = function(name, value, cfg, model) {
    var rules = cfg[name];
    var ruleKey = null;
    var r = true,
        hasValue = true;
    this.currentFormName = name;
    if (rules === null || rules === undefined) {
        return true;
    }
    var ruleKeys = this.getKeys(rules);
    if (rules.required) {
        r = this.required(value, rules.required);
    } else if (rules.twoRequired) {
        r = this.twoRequired.apply(this, ([value].concat(rules.twoRequired)));
    } else if (!(Type.isNnObject(value) || Type.isArray(value))) {
        hasValue = Strings.emptyOf(value,'').toString().replace(/\s/g, '') !== '';
    }
    if (!r || !hasValue) {
        return r;
    }

    var ruleHandler = null;
    for (var i = 0, k = ruleKeys.length; i < k; i++) {
        ruleKey = ruleKeys[i];
        if (ruleKey === 'required') {
            continue;
        }
        ruleHandler = this[ruleKey];
        if (!Type.isFunction(ruleHandler)) {
            continue;
        }
        var paras = [];
        var paramArray = Arrays.ensureArray(rules[ruleKey]);
        paras.push(value);
        paras.push.apply(paras, paramArray);
        paras.push(model);
        r = ruleHandler.apply(this, paras);
        if (!r || r === 'break') {
            break;
        }
    }
    if (r) {
        this.currentFormName = null;
    }
    return r;
}

/**
 * 非空校验器
 * @param value 值
 * @parma message 验证失败消息
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.required = function(value, message) {
    var r = !Strings.isBlank(value)
    return traslate(this.emitter, r, message, '不能为空', value);
}

/**
 * 二选一必填
 * @param v 值
 * @param attr 属性名
 * @parma message 验证失败消息 可不填
 * @param model 上下文对象 v2值来源于model[attr]
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.twoRequired = function(value, attr, message, model) {
    var r = !Strings.isBlank(value);
    var otherProp = attr;
    var other = null,
        final = false;
    if (Type.isFunction(otherProp)) {
        other = otherProp();
    } else {
        other = (model || {})[attr];
    }
    var r2 = !Strings.isBlank(other);
    if ((r || r2)) {
        final = true;
    }
    traslate(this.emitter, final, message, '不能为空', value);
    return r ? true : 'break';
}

/**
 * 邮件校验器
 * @param v 值
 * @parma message 验证失败消息
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.email = function(value, message) {
    var r = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
    return traslate(this.emitter, r, message, '请输入有效的电子邮件地址', value);
};

/**
 * url地址校验器
 * @param v 值
 * @parma message 验证失败消息 可不填
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.url = function(value, message) {
    var r = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
    return traslate(this.emitter, r, message, '请输入有效的网址', value);
};

/**
 * 时间校验器
 * @param v 值
 * @parma message 验证失败消息 可不填
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.date = function(value, message) {
    var r = !/Invalid|NaN/.test(new Date(value).toString());
    return traslate(this.emitter, r, message, '请输入有效的日期', value);
};

/**
 * ISO时间格式校验器
 * @param v 值
 * @parma message 验证失败消息 可不填
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.dateISO = function(value, message) {
    var r = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
    return traslate(this.emitter, r, message, '请输入有效的日期 (YYYY-MM-DD)', value);
};

/**
 * 整数格式校验器
 * @param v 值
 * @parma message 验证失败消息 可不填
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.number = function(value, message) {
    var r = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value, value);
    return traslate(this.emitter, r, message, '请输入有效的数字');
};

/**
 * 数字格式校验器
 * @param v 值
 * @parma message 验证失败消息 可不填
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.digits = function(value, message) {
    var r = /^\d+$/.test(value);
    return traslate(this.emitter, r, message, '只能输入数字', value);
};

/**
 * 银行卡号校验器
 * @param v 值
 * @parma message 验证失败消息 可不填
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.creditcard = function(value, message) {
    if (/[^0-9 \-]+/.test(value)) {
        return false;
    }
    var nCheck = 0,
        nDigit = 0,
        bEven = false,
        n, cDigit;

    value = value.replace(/\D/g, "");

    if (value.length < 13 || value.length > 19) {
        return false;
    }
    for (n = value.length - 1; n >= 0; n--) {
        cDigit = value.charAt(n);
        nDigit = parseInt(cDigit, 10);
        if (bEven) {
            if ((nDigit *= 2) > 9) {
                nDigit -= 9;
            }
        }
        nCheck += nDigit;
        bEven = !bEven;
    }
    var r = (nCheck % 10) === 0;
    return traslate(this.emitter, r, message, '请输入有效的信用卡号码', value);
};

/**
 * 最小长度校验器
 * @param v 值
 * @param min 最小长度
 * @parma message 验证失败消息 可不填
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.minlength = function(value, min, message) {
    var r = (value || '').length >= min;
    return traslate(this.emitter, r, message, '最少要输入 {0} 个字符', [min], value);
};

/**
 * 最大长度校验器
 * @param v 值
 * @param max 最大长度
 * @parma message 验证失败消息 可不填
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.maxlength = function(value, max, message) {
    var r = (value || '').length <= max;
    return traslate(this.emitter, r, message, '最多可以输入 {0} 个字符', [max], value);
};

/**
 * 长度范围校验
 * @param v 值
 * param min 最小长度
 * param max 最大长度
 * @parma message 验证失败消息 可不填
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.rangelength = function(value, min, max, message) {
    var len = (value || '').length;
    var r = len >= min && len <= max;
    return traslate(this.emitter, r, message, '请输入长度在 {0} 到 {1} 之间的字符串', [min, max], value);
};

/**
 * 最小值校验器
 * @param v 值
 * @param min 最小值
 * @parma message 验证失败消息 可不填
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.min = function(value, min, message) {
    var r = value >= min;
    return traslate(this.emitter, r, message, '请输入不小于 {0} 的数值', [min], value);
};

/**
 * 最大值校验
 * @param v 值
 * @param max 最大值
 * @parma message 验证失败消息 可不填
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.max = function(value, max, message) {
    var r = value <= max;
    return traslate(this.emitter, r, message, '请输入不大于 {0} 的数值', [max], value);
};

/**
 * 值范围校验
 * @param v 值
 * param min 最小值
 * param max 最大值
 * @parma message 验证失败消息 可不填
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.range = function(value, min, max, message) {
    var r = value >= min && value <= max;
    return traslate(this.emitter, r, message, '请输入范围在 {0} 到 {1} 之间的数值', [min, max], value);
};

/**
 * 手机号校验
 * @param v 值
 * @parma message 验证失败消息 可不填
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.mobile = function(value, message) {
    var r = /^1[1-9][0-9]\d{8}$/.test(value);
    return traslate(this.emitter, r, message, '请输入有效的手机号码', value);
};

/**
 * 手机号校验
 * @param v 值
 * @parma message 验证失败消息 可不填
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.tel = function(value, message) {
    var r = /^(\d{3,4}-)?\d{7,8}$/.test(value);
    return traslate(this.emitter, r, message, '请输入有效的电话号码', value);
};


/**
 * 校验两个值是否相等
 * @param v 值
 * @param attr 属性名
 * @parma message 验证失败消息 可不填
 * @param model 上下文对象 v2值来源于model[attr]
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.equalTo = function(value, attr, message, model) {
    model = model || {};
    var v2 = (model[attr]);
    var r = value != null && value === v2;
    return traslate(this.emitter, r, message, '值不匹配', value);
};

/**
 * 校验当前值 是否 小于指定属性值
 * @param v 值
 * @param attr 属性名
 * @parma message 验证失败消息 可不填
 * @param model 上下文对象 v2值来源于model[attr]
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.minTo = function(value, attr, message, model) {
    model = model || {};
    var v2 = (model[attr]);
    var r = value != null && Number(value) < Number(v2);
    return traslate(this.emitter, r, message, '{1}不能大于{2}', [r, v2], value);
};

/**
 * 校验当前值 是否 大于指定属性值
 * @param v 值
 * @param attr 属性名
 * @parma message 验证失败消息 可不填
 * @param model 上下文对象 v2值来源于model[attr]
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.maxTo = function(value, attr, message, model) {
    model = model || {};
    var v2 = (model[attr]);
    var r = value != null && Number(value) >= Number(v2);
    return traslate(this.emitter, r, message, '{1}不能小于{2}', [r, v2], value);
};

/**
 * 中华人民共和国身份证校验
 * @param v 值
 * @parma message 验证失败消息 可不填
 * @param model 上下文对象 v2值来源于model[attr]
 * @returns {boolean} 失败(false)/成功(true)
 */
ValidatorLibraryClass.prototype.idCard = function(value, message, params) {
    var sumNumbers = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var verfifyChars = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    var r = false;
    if (value.length == 15 && (!isNaN(value))) {
        r = true;
    } else if (value.length == 18) {
        var sum = 0;
        for (var i = 0, k = sumNumbers.length; i < k; i++) {
            sum = sum + Number(value[i]) * sumNumbers[i];
        }
        r = verfifyChars[(sum % 11)] === value[17];
    } else {
        r = false;
    }
    return traslate(this.emitter, r, message, '无效的身份证号码', params, value);
};


function traslate(emitter, r, message, defaultMessage, params, value) {
    if (!emitter) {
        return r;
    }
    message = Strings.blankOf(message, defaultMessage);
    var validator = emitter.validator;
    validator.currentMessage = message;
    if (!validator.slient) {
        if (!r) {
            var args = [];
            params = Arrays.ensureArray(params);
            args.push.apply(args, params);
            args.push((value || '').toString().substring(0, 10));
            emitter.emit('invalid', Strings.format2(message, args));
        } else {
            emitter.emit('valid');
        }
    }
    return r;
}

//引用附加
module.exports = ValidatorLibraryClass;