var gulp = require('gulp');
var gutil = require('gulp-util');
var react = require('gulp-react');
var gmon = require('gulp-nodemon');

gulp.task('default', function () {
  gulp.run('start');
  gulp.run('react');
});

gulp.task('react', function () {
    return gulp.src('./public/js/src/**/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('./public/js/dist'));
});

gulp.task('start', function () {
  gmon({
    script: 'bin/www'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
})

gulp.watch('./public/js/src/**/*.jsx', function () {
     gulp.run('react');
});
