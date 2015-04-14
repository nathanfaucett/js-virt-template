var gulp = require("gulp"),
    filePath = require("file_path"),
    minifyHTML = require("gulp-minify-html");


module.exports = function(config) {
    return function() {
        return gulp.src(config.paths.ejs_out)
            .pipe(minifyHTML())
            .pipe(gulp.dest(filePath.dir(config.paths.ejs_out)));
    };
};
