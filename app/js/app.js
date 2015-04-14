var virt = require("virt"),
    virtDOM = require("virt-dom"),
    modal = require("virt-modal"),
    page = require("page"),
    extend = require("extend"),
    map = require("map"),
    request = require("request"),
    environment = require("environment"),
    i18n = require("i18n"),
    i18nFn = require("./i18n"),
    dispatcher = require("./dispatcher"),
    router = require("./router"),
    config = require("./config");


var document = environment.document,
    ApplicationPrototype;


function Application() {

    this.config = config;

    this.__pages = {};
    this.__modals = {};

    this.node = null;

    this.page = page;
    this.i18n = i18nFn;
    this.dispatcher = dispatcher;
    this.router = router;
}
ApplicationPrototype = Application.prototype;

ApplicationPrototype.init = function() {
    var App = require("./components/app"),
        RouteStore = require("./stores/route_store"),
        UserStore = require("./stores/user_store"),

        dispatcher = this.dispatcher,
        config = this.config,
        page = this.page;

    request.defaults.headers["Content-Type"] = "application/json";
    request.defaults.withCredentials = true;

    this.node = document.getElementById("app");

    page.on("request", function onRequest(ctx) {
        dispatcher.handleViewAction({
            actionType: RouteStore.consts.ROUTE_CHANGE,
            ctx: ctx
        });
    });

    dispatcher.register(modal.ModalStore.registerCallback);

    UserStore.on("changeLocale", function onChangeLocale() {
        page.reload();
    });

    i18n.flatMode(config.flatLocaleMode);
    i18n.throwMissingError(config.throwMissingTranslationError);
    page.html5Mode(config.html5Mode);

    page.init();

    virtDOM.render(virt.createView(App), this.node);
};

ApplicationPrototype.registerPage = function(name, render) {
    this.__pages[name] = render;
};

ApplicationPrototype.getPage = function(name) {
    return this.__pages[name];
};

ApplicationPrototype.registerModal = function(name, render, onClose) {
    this.__modals[name] = {
        name: name,
        render: render,
        onClose: onClose
    };
};

ApplicationPrototype.getModals = function(ctx) {
    return map(this.__modals, function(m) {
        var result = extend({}, m),
            modalRender = m.render,
            modalOnClose = m.onClose;

        result.render = function(modal) {
            return modalRender(modal, ctx);
        };

        result.onClose = function(modal) {
            return modalOnClose(modal, ctx);
        };

        return result;
    });
};


module.exports = new Application();


require("./views");
require("./routes");
