var keyMirror = require("key_mirror"),
    dispatcher = require("../dispatcher"),
    EventEmitter = require("event_emitter");


var EVENT_CHANGE = "change";


module.exports = Store;


function Store() {

    EventEmitter.call(this, -1);

    this.consts = null;
}
EventEmitter.extend(Store);

Store.prototype.setConsts = function(object) {
    return (this.consts = keyMirror(object));
};

Store.prototype.emitChange = function() {
    this.emit(EVENT_CHANGE);
};

Store.prototype.addChangeListener = function(callback) {
    this.on(EVENT_CHANGE, callback);
};

Store.prototype.removeChangeListener = function(callback) {
    this.off(EVENT_CHANGE, callback);
};

Store.prototype.register = function(callback) {
    dispatcher.register(callback);
    return this;
};
