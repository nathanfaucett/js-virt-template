var gulp = require("gulp"),
    minifyJSON = require("gulp-jsonminify");


module.exports = function(config) {
    return function() {
        return gulp.src(config.paths.locale_out + "/**/*.json")
            .pipe(minifyJSON())
            .pipe(gulp.dest(config.paths.locale_out));
    };
};
