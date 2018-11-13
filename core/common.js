/**
 *  @name common utils
 * */

const _ = require('lodash');
const path = require('path');
/**
 *  @name logTips 提示弹框
 *  @param {string} str tips info
 *  @param {object} options tips config
 * */
function logTips (str, options) {
    console.log(str);
}

/**
 *  @name registerRoute 注册路由
 *  @param {string} path 路由匹配的路径
 *  @param {string} viewName view 的文件名字
 *  @return {array} 路由数据
 * */
function registerRoute(path, viewName) {
    // handle routes
    let _list = [];
    const _handler = require(getPath(viewName, '../routes/views/'));
    if (_.isFunction(_handler)) {
        _list.push({
            path: '/',
            handler: _handler,
        });
    } else if (_.isArray(_handler)) {
        _.forEach(_handler, function(item) {
            _list.push({
                path: item.path === '/' ? path : path + item.path,
                handler: item.handler,
                method: item.method,
            });
        });
    }
    return _list;
}
/**
 *  @name getPath 获取根目录下的路劲
 *  @param {string} str 匹配的文件
 *  @param {string} relativePath 相对根目录文件
 *  @return {string} 相对根目录文件路径
 * */
function getPath(str, relativePath) {
    // 直接定位到 views 文件夹下
    var _relativePath = relativePath || './../';
    return path.join(__dirname, _relativePath, str);
}

// export module
module.exports = {
    log: logTips,
    registerRoute: registerRoute,
    getPath: getPath,
};
