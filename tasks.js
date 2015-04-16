var tasks = require("tasks"),
    gaze = require("gaze"),
    livereload = require("livereload"),
    config = require("./config/application");


tasks.add("default", ["jsbeautifier", "jshint"]);


tasks.add("jshint", "", require("./config/tasks/jshint")(config));
tasks.add("jsbeautifier", "", require("./config/tasks/jsbeautifier")(config));


tasks.add("config", "compile config to build directory", require("./config/tasks/config")(config));
tasks.add("js", "compile js into one file", ["config"], require("./config/tasks/comn")(config));

tasks.add("css", "compile css into one file", require("./config/tasks/comn_css")(config));
tasks.add("ejs", "compile ejs into one file", require("./config/tasks/ejs")(config));


tasks.add("locale", "compiles locale files to build directory", require("./config/tasks/locale")(config));

tasks.add("clean", "clean build files", require("./config/tasks/clean")(config));
tasks.add("copy", "copy app files to build dir", require("./config/tasks/copy")(config));

tasks.add("serve", "serve build directory", require("./config/tasks/serve")(config));

tasks.add("uglify", "uglify build js", require("./config/tasks/uglify")(config));
tasks.add("minify_css", "minify build css", require("./config/tasks/minify_css")(config));
tasks.add("minify_html", "minify build html", require("./config/tasks/minify_html")(config));
tasks.add("minify_json", "minify build json", require("./config/tasks/minify_json")(config));

tasks.add("minify", "minify built app", ["uglify", "minify_css", "minify_html", "minify_json"]);

var buildTasks;
if (config.env !== "production") {
	buildTasks = ["js", "css", "ejs", "locale"];
} else {
	buildTasks = ["copy", "js", "css", "ejs", "locale"];
}

tasks.add("build", "build app in current env", buildTasks, function(done) {
    tasks.run("minify", done);
});

function reload() {
	livereload.reload();
}
tasks.add("js_reload", ["js"], reload);
tasks.add("css_reload", ["css"], reload);
tasks.add("ejs_reload", ["ejs"], reload);
tasks.add("locale_reload", ["locale"], reload);

function watch(files, task) {
    gaze(files, function(err, watcher) {
		watcher.on("all", function() {
			tasks.run(task);
		});
    });
}

tasks.add("watch", function() {
    watch([config.paths.js + "/**/*.js"], "js_reload");
    watch([config.paths.css + "/**/*.less", config.paths.css + "/**/*.css"], "css_reload");
    watch([config.paths.ejs_src], "ejs_reload");
    watch([config.paths.locale + "/**/*.json"], "locale_reload");
    watch([config.paths.root + "/config/settings/**/*.js"], "js_reload");
});

if (config.env !== "production") {
	tasks.add("run", "builds app and starts watching files", buildTasks, function() {
		tasks.run("watch");
		tasks.run("serve");
	});
} else {
	tasks.add("run", "builds app and starts watching files", ["build"], function() {
		tasks.run("watch");
		tasks.run("serve");
	});
}
