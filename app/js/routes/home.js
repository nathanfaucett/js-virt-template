var RouteStore = require("../stores/route_store"),
    app = require("../app");


app.router.route(
    "/",
    function handleRoot(ctx, next) {
        app.dispatcher.handleViewAction({
            actionType: RouteStore.consts.ROUTE_UPDATE,
            state: "home",
            ctx: ctx
        });
        ctx.end();
        next();
    }
);
