/**
 *  @name routers
 *  @author ukerxi
 *  @description register page route
 * */
const _ = require('lodash');
const common = require('./../core/common.js');
let routeList = [];

// 注册路由
// home page
_.forEach(common.registerRoute('/', 'home'), function(item) {
    routeList.push(item);
});
// template page
_.forEach(common.registerRoute('/post', 'template'), function(item) {
    routeList.push(item);
});

// 导出模块
module.exports = {
    list: routeList,
};

