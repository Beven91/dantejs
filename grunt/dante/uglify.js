/************************************************************
 * 名称:daten打包 压缩任务配置
 * 日期:2016-10-31
 * 描述:
 *************************************************************/
module.exports = function(grunt) {
    'use strict';

    let buildContext = grunt.buildContext;

    let config = {
        "options": {
            "banner": "/*!  <%= grunt.template.today(\"yyyy-mm-dd\") %> */\r\n",
            "ascii_only": true,
            "sourceMap": true
        },
        "build": {
            "src": buildContext.param('concat'),
            "dest": buildContext.param('uglify')
        }
    };

    grunt.config('uglify', config);
};