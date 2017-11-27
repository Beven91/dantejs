/************************************************************
 * 名称:daten打包 jshint lsmain库源文件语法检测
 * 日期:2016-10-31
 * 描述:用于把关js的一些不兼容的写法,以及一些规范
 *************************************************************/

module.exports = function(grunt) {
    'use strict';

    let buildContext = grunt.buildContext;

    let config = {
        "options": {
            "strict": false,
            "-W033": true,
            "-W015": true,
            "curly": true,
            "eqeqeq": false,
            "eqnull": true,
            "newcap": true,
            "browser": true,
            "asi": true,
            "lastsemic": true,
            "boss": true
        },
        "globals": {
            "jQuery": true,
            "window": true
        },
        "pre": buildContext.param('files')
    }

    grunt.config('jshint', config);
};