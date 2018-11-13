/**
 * 通用请求模块
 */

let request = require('request');
const _ = require('lodash');
let url = require('url');
const requestPro = require('request-promise');

// 选项配置
let options = {
    url: '',
    method: 'GET',
    headers: {
        'User-Agent': 'request',
        'content-type': 'application/x-www-form-urlencoded',
    },
    qs: {}, // get提交参数
    formData: {}, // post提交参数
    isPromise: false, // 是否使用promise进行
};
// 请求链接配置，区分正式环境和测试环境
let _baseUrl = 'https://wx.dudubashi.com'; // 正式环境
_baseUrl = 'http://apitest.dudubashi.com'; // 测试环境

/**
 * @name 统一执行请求
 * @param {object} new_options 请求参数配置，会覆盖原有的基础配置
 * @param {function} callback 请求回调
 * */
function handleRequest(new_options, callback) {
    let _options = _.extend({}, options);
    if (typeof new_options !== 'undefined') {
        _options = _.merge(_options, new_options);
    }
    let _parse_url = url.parse(_options.url);
    // 判断是否有域名，如果没有自动加上域名前缀
    if (!_parse_url.hostname) {
        _options.url = _baseUrl + _options.url;
    }
    if (_options.params) {
        if (_options.method === 'GET') {
            _options.qs = _options.params;
        } else if (_options.method === 'POST') {
            _options.formData = _options.params;
        }
    }
    if (_options.isPromise) {
        return requestPro(_options).then(async function (response) {
            if (typeof callback === 'function') {
                // 执行回调
                await callback(response ? JSON.parse(response) : '');
            }
        }).catch(async function (err) {
            if (typeof callback === 'function') {
                // 执行回调
                await callback({}, err);
            }
        });
    } else {
        request(_options, function (error, response, body) {
            let _result = null;
            if (!error && response.statusCode === 200) {
                _result = JSON.parse(body);
            }
            if (typeof callback === 'function') {
                // 执行回调
                callback(_result, response);
            }
        });
    }
}

// 导出
exports = module.exports = {
    /**
     * @name get 请求
     * @param url 请求链接
     * @param param 请求参数
     * @param callback 请求回调
     * @param new_options 请求参数配置，会覆盖原有的基础配置
     * */
    get: function(url, param, callback, new_options) {
        let _options = {};
        let _callback = callback;
        // 兼容参数，可以不传 请求参数
        if (typeof param === 'function') {
            _callback = param;
            new_options = callback || {};
            param = '';
        }
        if (typeof new_options !== 'undefined') {
            _options = _.merge(_options, new_options);
        }
        if (typeof url !== 'undefined' && url) {
            _options.url = url;
        }
        if (typeof param !== 'undefined' && param) {
            _options.params = param;
        }
        _options.method = 'GET';
        if (_options.isPromise) {
            return handleRequest(_options, _callback);
        } else {
            handleRequest(_options, _callback);
        }
    },
    /**
     * @name post 请求
     * @param {string} url 请求链接
     * @param {object} param 请求参数
     * @param {function} callback 请求回调
     * @param {object} new_options 请求参数配置，会覆盖原有的基础配置
     * */
    post: function(url, param, callback, new_options) {
        let _options = {};
        let _callback = callback;
        // 兼容参数，可以不传 请求参数
        if (typeof param === 'function') {
            _callback = param;
            new_options = callback || {};
            param = '';
        }
        if (typeof new_options !== 'undefined') {
            _options = _.merge({}, new_options);
        }
        if (typeof url !== 'undefined' && url) {
            _options.url = url;
        }
        if (typeof param !== 'undefined' && param) {
            _options.params = param;
        }
        _options.method = 'POST';
        if (_options.isPromise) {
            return handleRequest(_options, _callback);
        } else {
            handleRequest(_options, _callback);
        }
    },
    /**
     * @name  通用请求
     * @param {object} new_options 请求参数配置，会覆盖原有的基础配置
     * @param {function} callback 请求回调
     * */
    req: function(new_options, callback) {
        let _options = {};
        if (typeof new_options !== 'undefined') {
            _options = _.merge({}, new_options);
        }
        handleRequest(_options, callback);
    },
};
