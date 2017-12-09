const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');

gulp.task('styles', () => {
    return gulp.src('styles/**/*.scss')
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('css/'));
});

gulp.task('watch', () => {
    gulp.watch('styles/partials/*.scss',['styles']);
});

gulp.task('default', ['styles', 'scripts', 'watch']);

gulp.task('scripts', () => {
    gulp.src('scripts.js')
        // .pipe(babel({
        //     presets: ['env']
        // }))
        // .pipe(gulp.dest('./public/scripts'))
        // .pipe(reload({ stream: true }));
});