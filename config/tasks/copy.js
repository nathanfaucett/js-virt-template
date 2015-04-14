var gulp = require("gulp");


module.exports = function(config) {
    return function () {
        return gulp.src([
            config.paths.fonts + "**/*",
            config.paths.img + "**/*"
        ]).pipe(gulp.dest(config.paths.build));
    };
};
