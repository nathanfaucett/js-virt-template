var i18n = require("i18n"),
    request = require("request"),
    UserStore = require("../../stores/user_store");


var cache = {};


function i18nMiddleware(ctx, next) {
    var locale = UserStore.user.locale;

    if (cache[locale] === true) {
        next();
    } else {
        request.get("locale/" + locale + ".json", {
            success: function(response) {
                cache[locale] = true;
                i18n.add(locale, response.data);
                next();
            },
            error: function(response) {
                next(response.data);
            }
        });
    }
}


module.exports = i18nMiddleware;
