var Store = require("./store"),
    app = require("../app");


var RouteStore = module.exports = new Store(),

    _route = {
        context: {},
        state: null
    },

    consts = RouteStore.setConsts([
        "ROUTE_CHANGE",
        "ROUTE_UPDATE"
    ]);


function update(ctx, state) {
    var context = _route.context;

    context.fullUrl = ctx.fullUrl;
    context.pathname = ctx.pathname;
    context.query = ctx.query;
    context.params = ctx.params;

    _route.state = state;
}

function handleContext(ctx) {
    app.router.handler(ctx, function(err) {
        if (err) {
            throw err;
        }
    });
}

RouteStore.getState = function() {
    return _route.state;
};

RouteStore.getContext = function() {
    return _route.context;
};

RouteStore.toJSON = function() {
    return _route;
};

RouteStore.fromJSON = function(json) {
    _route = json;
};

RouteStore.register(function onRoutePayload(payload) {
    var action = payload.action;

    if (action.actionType === consts.ROUTE_CHANGE) {
        handleContext(action.ctx);
    } else if (action.actionType === consts.ROUTE_UPDATE) {
        update(action.ctx, action.state);
        RouteStore.emitChange();
    }
});
