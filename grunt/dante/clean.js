/************************************************************
 * 名称:daten打包 clean清除任务配置
 * 日期:2016-10-31
 * 描述:
 *************************************************************/
module.exports = function(grunt) {
    'use strict';

    let buildContext = grunt.buildContext;

    let config = {
        options: {
            force: true
        },
        dist: {
            src: buildContext.rootDIR
        }
    };

    grunt.config('clean', config);
};