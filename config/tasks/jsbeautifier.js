var gulp = require("gulp"),
    jsbeautifier = require("gulp-jsbeautifier");


module.exports = function(config) {
    return function() {
        return gulp.src([config.paths.js + "/**/*.js"])
            .pipe(jsbeautifier())
            .pipe(gulp.dest(config.paths.js));
    };
};
