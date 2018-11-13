/**
 *  @name route-views-home
 * */
const request = require('../../core/request');
const View = require('../../core/views')
const routeList = [];
routeList.push({
    method: 'get',
    path: '/',
    handler: async function (ctx, next) {
        ctx.locals.section = 'home';
        ctx.locals.data = {
            banner_list: [],
            news_list: [],
        };
        const view = new View(ctx, next);
        view.on('init', function (next) {
            request.post('/index.php/activities/banner', {
                city: '深圳市',
                show_type: 9,
            }, function (result) {
                view.ctx.locals.data.banner_list = result.data;
                next();
            });
        });
        view.on('init', function (next) {
            request.post('/index.php/official/news/get_list', {
                page: 1,
            }, function (result) {
                view.ctx.locals.data.news_list = result.data.list;
                next();
            });
        });
        await view.render('index');
    },
});

module.exports = routeList;
