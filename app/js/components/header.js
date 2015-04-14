var virt = require("virt"),
    propTypes = require("prop_types");


var HeaderPrototype;


module.exports = Header;


function Header(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(Header, "Header");

Header.contextTypes = {
    i18n: propTypes.func.isRequired
};

HeaderPrototype = Header.prototype;

HeaderPrototype.render = function() {
    return (
        virt.createView("div", {
                className: "header"
            },
            virt.createView("h1", this.context.i18n("app.name"))
        )
    );
};
