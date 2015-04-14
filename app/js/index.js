var environment = require("environment"),
    eventListener = require("event_listener"),
    app = require("./app");


eventListener.on(environment.window, "load DOMContentLoaded", function() {
    app.init();
});
