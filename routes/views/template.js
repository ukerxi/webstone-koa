/**
 *  @name route-views-template
 * */
const request = require('../../core/request');
const routeList = [];
routeList.push({
    method: 'get',
    path: '/',
    handler: async function(ctx, next) {
        ctx.response.type = 'html';
        ctx.response.body = 'test post';
        next();
    },
});

routeList.push({
    method: 'get',
    path: '/template',
    handler: async function(ctx, next) {
        await ctx.render('index', {
            text: '测试发顺丰似睡非睡',
        });
        next();
    },
});

routeList.push({
    method: 'get',
    path: '/333',
    handler: [
        async function(ctx, next) {
            ctx.locals.section = 'home';
            ctx.locals.data = {
                banner_list: [],
                news_list: [],
            };
            await request.post('/index.php/activities/banner', {
                city: '深圳市',
                show_type: 9,
            }, async function (result) {
                ctx.locals.data.banner_list = result.data;
                await next();
            }, {isPromise: true});
        },
        async function(ctx, next) {
            await request.post('/index.php/official/news/get_list', {
                page: 1,
            }, async function (result) {
                ctx.locals.data.news_list = result.data.list;
                await next();
            }, {isPromise: true});
        },
        async function(ctx, next) {
            ctx.locals.test_trrr = 'sfsfsfsf';
            await ctx.render('index', ctx.locals);
            next();
        },
    ],
});

module.exports = routeList;
