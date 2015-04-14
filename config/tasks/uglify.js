var gulp = require("gulp"),
    filePath = require("file_path"),
    uglify = require("gulp-uglify");


module.exports = function(config) {
    return function() {
        return gulp.src(config.paths.js_out)
            .pipe(uglify())
            .pipe(gulp.dest(filePath.dir(config.paths.js_out)));
    };
};
