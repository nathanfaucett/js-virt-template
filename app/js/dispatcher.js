var EventEmitter = require("event_emitter");


var DispatcherPrototype,

    DISPATCH = "dispatch",
    VIEW_ACTION = "VIEW_ACTION",
    SERVER_ACTION = "SERVER_ACTION";


function Dispatcher() {
    EventEmitter.call(this, -1);
}
EventEmitter.extend(Dispatcher);
DispatcherPrototype = Dispatcher.prototype;

DispatcherPrototype.register = function(callback) {
    return this.on(DISPATCH, callback);
};

DispatcherPrototype.unregister = function(callback) {
    return this.off(DISPATCH, callback);
};

DispatcherPrototype.dispatch = function(payload) {
    return this.emit(DISPATCH, payload);
};

DispatcherPrototype.handleViewAction = function(action) {
    this.dispatch({
        source: VIEW_ACTION,
        action: action
    });
};

DispatcherPrototype.handleServerAction = function(action) {
    this.dispatch({
        source: SERVER_ACTION,
        action: action
    });
};


module.exports = new Dispatcher();
