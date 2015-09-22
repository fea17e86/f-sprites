/* constants and plugins */

const config = {};
config.nodeModules = 'node_modules/';
config.src = 'src/';
config.bin = 'bin/';
config.libraryName = 'fexture.js';
config.examples = 'examples/';
config.examplesCss = config.examples + 'css/';

var gulp = require('gulp'),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    connect = require('gulp-connect');


/* build tasks */

gulp.task('html', function () {
  return connect.reload();
});

gulp.task('css', function (callback) {
  return gulp.src(config.examplesCss + '**/*.css')
    .pipe(sourcemaps.init())
      .pipe(autoprefixer('last 2 version'))
      .pipe(concat('style.css'))
      .pipe(minifyCss({compatibility: 'ie8'}))
      .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.examplesCss))
    .pipe(connect.reload());
});

gulp.task('fexture', ['concat-fexture'], function () {
  return gulp.start('minify-fexture');
});

gulp.task('concat-fexture', function () {
  return gulp.src(config.src + '**/*.js')
    .pipe(sourcemaps.init())
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(concat(config.libraryName))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.bin));
});

gulp.task('minify-fexture', function () {
  return gulp.src(config.bin + '**/*.js')
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.bin))
    .pipe(connect.reload());
});


/* watch */

gulp.task('watch', function () {
  gulp.watch(config.examples + '**/*.html', ['html']);
  gulp.watch(config.examplesCss + '**/*.css', ['css']);
  gulp.watch(config.src + '**/*.js', ['fexture']);
});


/* connect */

gulp.task('server', function() {
  connect.server({
    livereload: true
  });
});


/* public tasks */

gulp.task('clean', function (callback) {
  return del(config.bin, callback);
});

gulp.task('build', ['clean'], function () {
  return gulp.start('fexture', 'css', 'html');
});

gulp.task('dev', ['build'], function () {
  return gulp.start('server', 'watch');
});

gulp.task('default', ['dev']);
