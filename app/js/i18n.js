var i18n = require("i18n"),
    fastSlice = require("fast_slice"),
    UserStore = require("./stores/user_store");


module.exports = function(key) {
    return i18n(UserStore.user.locale, key, fastSlice(arguments, 1));
};
