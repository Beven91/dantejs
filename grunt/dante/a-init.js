/************************************************************
 * 名称:dante打包 初始化全局宏
 * 日期:2016-10-31
 * 描述:主要用来初始化打包过程的一些通用参数与宏等
 *************************************************************/
module.exports = function(grunt) {

    let path = require('path');

    let GruntBuildContext = require('../context.js').GruntBuildContext;

    //这里根据不同的打包类型 设置不同的目标目录
    let dir = 'dante';

    //设置本次打包目标目录
    let rootDIR = path.resolve('./dist/dante');

    //创建打包上下文
    let context = grunt.buildContext = new GruntBuildContext(rootDIR, grunt);

    let files = [
        'src/base/base.js',
        'src/base/type.js',
        'src/base/string.js',
        'src/base/date.js',
        'src/base/array.js',
        'src/base/function.js',
        'src/base/number.js',
        'src/base/list.js',
        'src/extension/promise.js',
        'src/extension/emitter.js',
        'src/extension/browser.js',
        'src/extension/cookie.js',
        'src/extension/pool.js',
        'src/extension/timer.js',
        'src/extension/urlparser.js',
        'src/extension/validator.js'
    ]

    grunt.buildContext.init({
        /*js 合并目标文件*/
        concat: context.join('dante.js'),
        /*js 压缩目标文件*/
        uglify: context.join('dante.min.js'),
        /*文档生成模块路径*/
        doc: path.resolve('./docs'),
        /*打包文件*/
        files: files
    });
}