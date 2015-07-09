var gulp = require('gulp');
var gutil = require('gulp-util');
var gmon = require('gulp-nodemon');
var babel = require('gulp-babel');

gulp.task('default', ['scripts', 'react', 'start']);

gulp.task('scripts', function () {
  return gulp.src('./public/js/src/**/*.js')
      .pipe(gulp.dest('./public/js/dist'));
});

gulp.task('react', function () {
    return gulp.src('./public/js/src/**/*.jsx')
        .pipe(babel())
        .pipe(gulp.dest('./public/js/dist'));
});

gulp.task('start', function () {
  gmon({
    script: 'bin/www'
  , ext: 'js css html'
  , env: { 'NODE_ENV': 'development' }
  })
})

gulp.watch('./public/js/src/**/*.jsx', ['react']);

gulp.watch('./public/js/src/**/*.js', ['scripts']);
