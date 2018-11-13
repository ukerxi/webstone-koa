/**
 *  @name webstone
 *  @version 0.1.0
 *  @author ukerxi
 *  @description the entry of the project
* */

const webstone = require('./core/webstone.js');
// 初始化配置
webstone.init({
    name: 'webstone', // project name
    static_path: 'public', // static file path
    port: 3000,
    env: 'development', // 'production'
    engine: 'handlebars',
    engine_config: {
        map: {hbs: 'handlebars'},
        cache: false,
        extension: 'hbs',
        options: {
            partialsDir: 'templates/views/partials',
            viewsDir: 'templates/views',
            helpersDir: 'templates/views/helpers',
        },
    },
});

// 启动项目
webstone.start();
