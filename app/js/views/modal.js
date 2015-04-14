var virt = require("virt"),
    modal = require("virt-modal"),
    app = require("../app");


var ModalStore = modal.ModalStore;


app.registerModal("modal",
    function renderModal( /* modal, ctx */ ) {
        return (
            virt.createView("p", app.i18n("modal.hello_world"))
        );
    },
    function onCloseModal(modal /* ctx */ ) {
        app.dispatcher.handleViewAction({
            actionType: ModalStore.consts.MODAL_CLOSE,
            id: modal.id
        });
    }
);
