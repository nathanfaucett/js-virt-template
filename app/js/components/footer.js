var virt = require("virt"),
    propTypes = require("prop_types"),
    app = require("../app"),
    UserStore = require("../stores/user_store");


var FooterPrototype;


module.exports = Footer;


function Footer(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.onClick = function(e) {
        return _this.__onClick(e);
    };
}
virt.Component.extend(Footer, "Footer");

Footer.contextTypes = {
    i18n: propTypes.func.isRequired
};

FooterPrototype = Footer.prototype;

FooterPrototype.__onClick = function(e) {
    var DOMNode = e.currentTarget;

    e.preventDefault();

    app.dispatcher.handleViewAction({
        actionType: UserStore.consts.USER_CHANGE_LOCALE,
        locale: DOMNode.getAttribute("data-locale")
    });
};

FooterPrototype.render = function() {
    var i18n = this.context.i18n;

    return (
        virt.createView("div", {
                className: "footer"
            },
            virt.createView("div", {
                    className: "wrap"
                },
                virt.createView("div", {
                        className: "grid"
                    },
                    virt.createView("div", {
                            className: "col-sm-6"
                        },
                        virt.createView("div", {
                                className: "locale"
                            },
                            virt.createView("img", {
                                className: "icon",
                                src: "img/earth_icon.png"
                            }),
                            virt.createView("a", {
                                    "data-locale": "en",
                                    onClick: this.onClick
                                },
                                i18n("footer.en")
                            )
                        )
                    ),
                    virt.createView("div", {
                            className: "col-sm-6"
                        },
                        virt.createView("div", {
                                className: "copy"
                            },
                            virt.createView("p", null,
                                "© " + (new Date()).getFullYear() + " " + i18n("app.name")
                            )
                        )
                    )
                )
            )
        )
    );
};
