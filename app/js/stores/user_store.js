var cookies = require("cookies"),
    indexOf = require("index_of"),
    request = require("request"),
    emptyFunction = require("empty_function"),
    config = require("../config"),
    Store = require("./store");


var UserStore = module.exports = new Store(),

    consts = UserStore.setConsts([
        "USER_SIGN_IN",
        "USER_SIGN_UP",
        "USER_SIGN_OUT",
        "USER_RESEND_CONFIRMATION",
        "USER_CHANGE_LOCALE",
        "USER_UPDATE"
    ]),

    navigatorLanguage = (
        navigator.language ||
        (navigator.userLanguage && navigator.userLanguage.replace(/-[a-z]{2}$/, String.prototype.toUpperCase)) ||
        "en"
    ),

    defaultLocale = indexOf(config.locales, navigatorLanguage) !== -1 ? navigatorLanguage : config.locales[0];


var _users = {
    1: {
        id: 1,
        api_key: "249r8hr7f0eh24q07hf780awgf7ds8f72498ry89dchfoud",
        confirmed: true,
        email: "nathanfaucett@gmail.com",
        password: "123456",
        locale: "en"
    }
};


UserStore.user = {
    api_key: null,
    confirmed: false,
    email: null,
    locale: defaultLocale
};

UserStore.toJSON = function() {
    return {
        users: _users,
        user: UserStore.user
    };
};

UserStore.fromJSON = function(json) {
    var user = json.user;

    _users = json.users;
    if (user.api_key) {
        signUserIn(user);
    }
};

function updateUser(data, callback) {
    request.patch(config.apiUrl + "/sessions", data, {
        success: function(response) {
            callback(undefined, response.data);
        },
        error: function(response) {
            callback(response);
        }
    });
}

UserStore.setLocale = function(value, callback) {
    var changed = setLocale(value);

    if (changed) {
        updateUser({
            locale: value
        }, callback || emptyFunction);
    }

    return changed;
};

function setLocale(value) {
    var last = UserStore.user.locale;

    value = indexOf(config.locales, value) === -1 ? config.locales[0] : value;

    if (last !== value) {
        UserStore.user.locale = value;
        return true;
    } else {
        return false;
    }
}

UserStore.isSignedIn = function() {
    return UserStore.user.api_key !== null;
};

UserStore.confirmEmail = function(email, expiresAt, token, callback) {
    request.patch(config.apiUrl + "/confirmations", {
        email: email,
        expires_at: expiresAt,
        token: token
    }, {
        success: function() {
            UserStore.user.confirmed = true;
            callback();
        },
        error: function(response) {
            callback(response);
        }
    });
};

UserStore.resendConfirmEmail = function(email, callback) {
    request.post(config.apiUrl + "/confirmations", {
        email: email
    }, {
        success: function() {
            callback();
        },
        error: function(response) {
            callback(response);
        }
    });
};

function signUserIn(data) {
    var user = UserStore.user;

    user.api_key = data.api_key;
    user.locale = data.locale || defaultLocale;
    user.confirmed = data.confirmed;
    user.email = data.email;

    cookies.set("api_key", data.api_key);
    request.defaults.headers["X-Testcloud-Key"] = data.api_key;
}

function signUserOut() {
    var user = UserStore.user;

    user.api_key = null;
    user.confirmed = false;
    user.email = null;

    cookies.remove("api_key");
    delete request.defaults.headers["X-Testcloud-Key"];
}

UserStore.signInWithApiKey = function(api_key, callback) {
    /*
     *setTimeout(function() {
        signUserIn(_users[1]);
        callback(undefined, _users[1]);
    }, config.fakeLatencyMin + Math.random() * (config.fakeLatencyMax - config.fakeLatencyMin));
    */
    request.get(config.apiUrl + "/sessions", {
        headers: {
            "X-Testcloud-Key": api_key
        },
        success: function(response) {
            var user = response.data;

            signUserIn(user);
            callback(undefined, user);
        },
        error: function(response) {
            signUserOut();
            callback(response);
        }
    });
};

UserStore.signInWithCredentials = function(email, password, callback) {
    /*
    setTimeout(function() {
        signUserIn(_users[1]);
        callback(undefined, _users[1]);
    }, config.fakeLatencyMin + Math.random() * (config.fakeLatencyMax - config.fakeLatencyMin));
    */
    request.post(config.apiUrl + "/sessions", {
        email: email,
        password: password
    }, {
        success: function(response) {
            var user = response.data;

            signUserIn(user);
            callback(undefined, user);
        },
        error: function(response) {
            callback(response);
        }
    });
};

UserStore.signInWithOneTimeToken = function(email, token, callback) {
    request.post(config.apiUrl + "/otp_verify", {
        email: email,
        otp: token
    }, {
        success: function(response) {
            var user = response.data;

            signUserIn(user);
            callback(undefined, user);
        },
        error: function(response) {
            callback(response);
        }
    });
};

UserStore.signUp = function(email, password, firstname, lastname, locale, callback) {
    request.post(config.apiUrl + "/registrations", {
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname,
        locale: locale
    }, {
        success: function(response) {
            var user = response.data;

            signUserIn(user);
            callback(undefined, user);
        },
        error: function(response) {
            callback(response);
        }
    });
};

UserStore.register(function onUserPayload(payload) {
    var action = payload.action;

    switch (action.actionType) {

        case consts.USER_SIGN_OUT:
            signUserOut();
            UserStore.emit("signOut");
            break;

        case consts.USER_SIGN_UP:
            UserStore.signUp(
                action.email, action.password, action.firstname, action.lastname, action.locale,
                function(err, user) {
                    if (err) {
                        UserStore.emit("signUp", err.data.errors);
                    } else {
                        UserStore.emit("signUp", undefined, user);
                    }
                }
            );
            break;

        case consts.USER_SIGN_IN:
            UserStore.signInWithCredentials(action.email, action.password, function(err, user) {
                if (err) {
                    UserStore.emit("signIn", err.data.errors);
                } else {
                    UserStore.emit("signIn", undefined, user);
                }
            });
            break;

        case consts.USER_CHANGE_LOCALE:
            if (UserStore.setLocale(action.locale)) {
                UserStore.emit("changeLocale");
            }
            break;

        case consts.USER_RESEND_CONFIRMATION:
            UserStore.resendConfirmEmail(action.email, function(err) {
                if (err) {
                    UserStore.emit("resendConfirmation", err.data.errors);
                } else {
                    UserStore.emit("resendConfirmation");
                }
            });
            break;
    }
});
