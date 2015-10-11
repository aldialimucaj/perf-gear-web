var gulp = require('gulp');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var gmon = require('gulp-nodemon');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();

gulp.task('default', ['scripts', 'react','browser-sync']);

gulp.task('scripts', function () {
  return gulp.src('./public/js/src/**/*.js')
      .pipe(gulp.dest('./public/js/dist'));
});

gulp.task('react', function () {
    return gulp.src('./public/jsx/src/**/*.jsx')
        .pipe(babel())
        .pipe(gulp.dest('./public/js/dist'));
});

gulp.task('browser-sync', ['start'], function() {
  browserSync.init({
    baseDir: "./",
    port: 3000,
    proxy: "http://localhost:4000",
    open: false
	});

  gulp.watch('./public/jsx/src/**/*.jsx', ['react']).on('change', browserSync.reload);
  gulp.watch('./public/js/src/**/*.js', ['scripts']).on('change', browserSync.reload);
  gulp.watch("./public/stylesheets/**/*.css").on('change', browserSync.reload);

});

gulp.task('start', function (cb) {
  var started = false;

  gmon({
    script: 'bin/www'
  , ext: 'html'
  , env: { 'NODE_ENV': 'development' }
  }).on('start', function () {
		if (!started) {
			cb();
			started = true;
		}
	});
})
