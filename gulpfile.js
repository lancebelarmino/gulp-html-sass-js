const { src, dest, watch, series } = require('gulp');

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();



// Html Task
function htmlTask() {
  return src('./src/*.html')
    .pipe(dest('./dist'));
}

// Sass Task
function scssTask() {
  return src('./src/sass/**/*.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(autoprefixer())
    .pipe(concat('main.css'))
    .pipe(dest('./dist/css', { sourcemaps: './' }));
}

// Javascript Task
function jsTask() {
  return src('./src/scripts/**/*.js', { sourcemaps: true })
    .pipe(concat('bundle.js'))
    .pipe(terser())
    .pipe(dest('./dist/scripts', { sourcemaps: './' }));
}

// Assets Task
function assetsTask() {
  return src('./src/assets/*')
  .pipe(imagemin())
  .pipe(dest('./dist/assets/'));
}

// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: './dist'
    }
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('./src/*.html', series(htmlTask, browsersyncReload))
  watch('./src/sass/**/*.scss', series(scssTask, browsersyncReload));
  watch('./src/scripts/**/*.js', series(jsTask, browsersyncReload));
} 

// Default Gulp Task
exports.default = series(
  htmlTask,
  scssTask,
  jsTask,
  assetsTask,
  browsersyncServe,
  watchTask
);