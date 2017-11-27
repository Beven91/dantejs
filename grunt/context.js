/**
 * 名称:打包上下文类定义
 * 日期:2016-10-31
 * 作者:Beven
 * 描述:
 */

var path = require('path');
var fs = require('fs');

function GruntBuildContext(rootDIR, _grunt) {
    //rootDIR 打包根目录
    this.rootDIR = path.resolve(rootDIR);
    // grunt对象
    this.grunt = _grunt;
}

/**
 * 初始化打包上下文
 * @param options 打包基础配置参数
 */
GruntBuildContext.prototype.init = function(options) {
    this.options = options;
}

/**
 * 获取指定参数值
 * @param name 参数名称git
 * @param dv 当前要获取的参数如果不存在 则使用该默认值
 */
GruntBuildContext.prototype.param = function(name, dv) {
    var v = this.options[name];
    if (v == null) {
        v = dv;
    }
    return v;
}

/**
 * 设置指定参数值
 * @param name 参数名称git
 * @param v 参数值
 */
GruntBuildContext.prototype.setParam = function(name, v) {
    this.options[name] = v;
}



/**
 * 返回一个路径,该路径会默认拼接baseDIR
 * @param relaPath1 相对路径1
 * .....
 * @param relaPathN 相对路径N
 */
GruntBuildContext.prototype.join = function() {
    var args = Array.prototype.slice.call(arguments, 0, arguments.length);
    args.unshift(this.rootDIR);
    var src = path.join.apply(path, args);
    return src;
}

/**
 * 获取控制台shell脚本命令参数
 */
GruntBuildContext.prototype.getProcessParams = function() {
    var yargs = require('yargs');
    return yargs(process.argv).argv;
}


/**
 * 同步执行shell命令
 */
GruntBuildContext.prototype.shell = function(cmd, path) {
    require('child_process').execSync(cmd, {
        maxBuffer: 2 * 1024 * 1024,
        killSignal: 'SIGTERM',
        cwd: path,
        env: process.env
    });
}

/**
 * 异步执行shell命令
 */
GruntBuildContext.prototype.shell2 = function(cmd, path) {
    require('child_process').exec(cmd, {
        maxBuffer: 2 * 1024 * 1024,
        killSignal: 'SIGTERM',
        cwd: path,
        env: process.env
    });
}

//设置模块引用
module.exports.GruntBuildContext = GruntBuildContext;