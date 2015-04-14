var virt = require("virt"),
    propTypes = require("prop_types"),
    modal = require("virt-modal"),
    app = require("../../app");


var LayoutNoHeaderPrototype;


module.exports = LayoutNoHeader;


function LayoutNoHeader(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(LayoutNoHeader, "LayoutNoHeader");
LayoutNoHeaderPrototype = LayoutNoHeader.prototype;

LayoutNoHeader.propTypes = {
    ctx: propTypes.object.isRequired,
    i18n: propTypes.func.isRequired,
    render: propTypes.func.isRequired
};

LayoutNoHeader.childContextTypes = {
    ctx: propTypes.object.isRequired,
    i18n: propTypes.func
};

LayoutNoHeaderPrototype.getChildContext = function() {
    return {
        ctx: this.props.ctx,
        i18n: this.props.i18n
    };
};

LayoutNoHeaderPrototype.render = function() {
    return (
        virt.createView("div", {
                className: "layout no-header"
            },
            virt.createView("div", {
                    className: "content"
                },
                this.props.render(),
                virt.createView(modal.Modals, {
                    modals: app.getModals(this.props.ctx)
                })
            )
        )
    );
};
