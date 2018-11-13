/**
 * @name hbs helpers
 * */
const _ = require('lodash');

// Collection of templates to interpolate
var linkTemplate = _.template('<a href="<%= url %>"><%= text %></a>');

module.exports = function() {

    var _helpers = {};

    /**
     * Generic HBS Helpers
     * ===================
     */

    // standard hbs equality check, pass in two values from template
    // {{#ifeq keyToCheck data.myKey}} [requires an else blockin template regardless]
    _helpers.ifeq = function (a, b, options) {
        if (a == b) { // eslint-disable-line eqeqeq
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    };

    _helpers.baseUrl = function (url, options) {
        return '' + url;
    };

    // index brandbar
    _helpers.brandList = function () {
        var brandList = '';
        for (var i = 1; i < 16; i++) {
            brandList += '<li><img src="/images/index/logo' + i + '.png"/></li>';
        }
        return brandList;
    };

    /*
    * expecting the data.posts context or an object literal that has `previous` and `next` properties
    * ifBlock helpers in hbs - http://stackoverflow.com/questions/8554517/handlerbars-js-using-an-helper-function-in-a-if-statement
    * */
    _helpers.ifHasPagination = function (postContext, options) {
        // if implementor fails to scope properly or has an empty data set
        // better to display else block than throw an exception for undefined
        if (_.isUndefined(postContext)) {
            return options.inverse(this);
        }
        if (postContext.next || postContext.previous) {
            return options.fn(this);
        }
        return options.inverse(this);
    };

    _helpers.paginationNavigation = function (pages, currentPage, totalPages, options) {
        var html = '';

        // pages should be an array ex.  [1,2,3,4,5,6,7,8,9,10, '....']
        // '...' will be added by keystone if the pages exceed 10
        _.each(pages, function (page, ctr) {
            // create ref to page, so that '...' is displayed as text even though int value is required
            var pageText = page;
            // create boolean flag state if currentPage
            var isActivePage = ((page === currentPage) ? true : false);
            // need an active class indicator
            var liClass = ((isActivePage) ? ' class="active"' : '');

            // if '...' is sent from keystone then we need to override the url
            if (page === '...') {
                // check position of '...' if 0 then return page 1, otherwise use totalPages
                page = ((ctr) ? totalPages : 1);
            }

            // get the pageUrl using the integer value
            var pageUrl = _helpers.pageUrl(page);
            // wrapup the html
            html += '<li' + liClass + '>' + linkTemplate({url: pageUrl, text: pageText}) + '</li>\n';
        });
        return html;
    };

    // special helper to ensure that we always have a valid page url set even if
    // the link is disabled, will default to page 1
    _helpers.paginationPreviousUrl = function (previousPage, totalPages) {
        if (previousPage === false) {
            previousPage = 1;
        }
        return _helpers.pageUrl(previousPage);
    };

    // special helper to ensure that we always have a valid next page url set
    // even if the link is disabled, will default to totalPages
    _helpers.paginationNextUrl = function (nextPage, totalPages) {
        if (nextPage === false) {
            nextPage = totalPages;
        }
        return _helpers.pageUrl(nextPage);
    };

    return _helpers;
};
