var virt = require("virt"),
    app = require("../app"),
    UserStore = require("../stores/user_store"),
    LayoutApp = require("../components/layouts/layout_app"),
    LayoutNoHeader = require("../components/layouts/layout_no_header");


app.registerPage("not_found", function renderNotFoundPage(ctx) {
    return (
        virt.createView(UserStore.isSignedIn() ? LayoutApp : LayoutNoHeader, {
            ctx: ctx,
            render: function() {
                return (
                    virt.createView("div", {
                            className: "wrap"
                        },
                        virt.createView("div", {
                                className: "page not-found"
                            },
                            virt.createView("h1", app.i18n("errors.not_found"))
                        )
                    )
                );
            }
        })
    );
});
