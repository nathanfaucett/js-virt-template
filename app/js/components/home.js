var virt = require("virt"),
    propTypes = require("prop_types"),
    modal = require("virt-modal"),
    app = require("../app");


var HomePrototype;


module.exports = Home;


function Home(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(Home, "Home");

HomePrototype = Home.prototype;

Home.contextTypes = {
    i18n: propTypes.func.isRequired
};

function openModal() {
    app.dispatcher.handleViewAction({
        actionType: modal.ModalStore.consts.MODAL_OPEN,
        name: "modal"
    });
}

HomePrototype.render = function() {
    return (
        virt.createView("div", {
            className: "home"
        }, virt.createView("a", {
            onClick: openModal
        }, this.context.i18n("home.open_modal")))
    );
};
