/**
 * 通用views 控制层
 */

const async = require('async');

function View(ctx, next) {
    if (!ctx) {
        throw new Error('Error: Express request object is required.');
    }
    this.ctx = ctx;
    this.next = next;
    this.initQueue = []; // executed first in series
}

module.exports = View;

View.prototype.on = function (on, callback) {
    if (on === 'init') {
        this.initQueue.push(callback);
    }
    return this;
};

View.prototype.render = function (viewPath, locals) {
    const ctx = this.ctx;
    const self = this;
    const renderFn = async function (resolve) {
        if (typeof locals === 'undefined') {
            locals = this.ctx.locals;
        }
        await this.ctx.render(viewPath, locals);
        resolve();
        console.log(this.ctx);
    }.bind(this);
    return new Promise(function (resolve, reject) {
        async.eachSeries(self.initQueue, function (i, next) {
            if (Array.isArray(i)) {
                // process nested arrays in parallel
                async.parallel(i, next);
            } else if (typeof i === 'function') {
                // process single methods in series
                i(next);
            } else {
                throw new Error('View.render() events must be functions.');
            }
        }, function (err) {
            renderFn(resolve);
        });
    });
};

