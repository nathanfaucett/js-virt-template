var gulp = require("gulp"),
    filePath = require("file_path"),
    minifyCSS = require("gulp-minify-css");


module.exports = function(config) {
    return function() {
        return gulp.src(config.paths.css_out)
            .pipe(minifyCSS())
            .pipe(gulp.dest(filePath.dir(config.paths.css_out)));
    };
};
