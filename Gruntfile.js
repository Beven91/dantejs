 /*******************************************************
  * 名称：通用库浏览器端打包grunt配置文件
  * 日期：2016-10-31
  * 版本：0.0.1
  *******************************************************/
 module.exports = function(grunt) {
     'use strict';

     //装载grunt 任务插件
     require('load-grunt-tasks')(grunt);

     //初始化grunt配置
     grunt.initConfig({
         pkg: grunt.file.readJSON('package.json')
     });

     //开启装载 任务
     grunt.loadTasks('grunt/dante');

     grunt.registerTask('build', [
         'clean',
         'concat',
         'jshint',
         'uglify',
         'doc'
    ]);

     grunt.registerTask('default', 'build');
 }