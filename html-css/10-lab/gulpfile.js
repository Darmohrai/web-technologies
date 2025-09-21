const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));

// Задача для компіляції Pug
gulp.task('pug', () => {
  return gulp.src('src/pug/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist/html'));
});

// Задача для компіляції SASS
gulp.task('sass', () => {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

// Задача для спостереження
gulp.task('watch', () => {
  gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
  gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
});

// Задача за замовчуванням
gulp.task('default', gulp.series('pug', 'sass', 'watch'));
