/**
 *  @name route-views-home
 * */

module.exports = async function(ctx, next) {
    try {
        await next();
        if (ctx.status === 404) {
            ctx.throw(404);
        }
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            message: err.message,
        };
    }
};
