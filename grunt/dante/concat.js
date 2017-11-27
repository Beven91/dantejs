/************************************************************
 * 名称:daten打包 contact合并任务配置
 * 日期:2016-10-31
 * 描述:按照依赖先后顺序合并lsmain目录对应的js文件
 *************************************************************/

module.exports = function(grunt) {
    'use strict';

    let buildContext = grunt.buildContext;

    let config = {
        "options": {
            "separator": ";\r\n",
            "banner": "/**\r\n    ！！！！ 系统生成\r\n    名称：链尚网通用库(Dante)(调试模式)\r\n    日期：<%= grunt.template.today(\"yyyy-mm-dd\") %>\r\n    版本：<%= pkg.version %>\r\n    ！！！！注意：当前文件由系统文件合并生成，仅供调试用，请不要直接更改其中代码，\r\n          如需要更改代码，请找到该代码对应的文件进行修改，然后再重新打包 \r\n*/\r\n",
            "footer": "",
            "process": (src, filepath) => `\r\n//以下代码源文件：(${filepath})如需调整代码，请更改此路径文件 \r\n ${src}`
        },
        dist: {
            src: buildContext.param('files'),
            dest: buildContext.param('concat')
        }
    };
    grunt.config('concat', config);
};