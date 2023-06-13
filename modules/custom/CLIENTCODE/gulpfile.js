const gulp = require('gulp');
const { series } = require('gulp');
const gutil = require('gulp-util');
const fs = require('fs');
const path = require('path');
const extend = require('extend');
const rename = require('gulp-rename');
const execSync = require('child_process').execSync;
const sass = require('gulp-sass')(require('sass'));
const glob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
let drupalInfo;
let drushCommand = 'drush';
let root = gutil.env.root;
let ddevStatus = false;
let watchStatus = false;
let config = {
  css: {
    dest: 'css/EXOTHEMENAME',
    src: ['src/ExoTheme/**/scss/*.scss'],
    includePaths: [],
  },
};

// If config.js exists, load that config for overriding certain values below.
function loadConfig() {
  if (fs.existsSync('./config.local.json')) {
    config = extend(true, config, require('./config.local'));
  }
  return config;
}
loadConfig();

function drupal(cb) {
  let command = drushCommand + ' status --format=json';
  let localRoot = testDir(splitPath(__dirname));
  if (root) {
    localRoot = testDir(splitPath(root));
    process.chdir(root);
  }
  drupalInfo = JSON.parse(execSync(command).toString());
  drupalInfo.root = localRoot + '/web';
  cb();
}

function exo(cb) {
  const root = process.env.DDEV_EXTERNAL_ROOT || drupalInfo['root'];
  let command = drushCommand + ' exo-scss';
  if (ddevStatus) {
    command = 'ddev exec "export DDEV_EXTERNAL_ROOT=' + root + ' && drush exo-scss"';
  }
  else if (root) {
    command += ' --root="' + root + '"';
  }
  execSync(command);
  config.css.includePaths.push(root + '/' + drupalInfo['site'] + '/files/exo');
  cb();
}

function css(cb) {
  gulp.src(config.css.src)
    .pipe(glob())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: config.css.includePaths
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browserlist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rename(function(obj) {
      obj.dirname = config.css.dest;
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('.'))
    .on('finish', function () {
      cb();
    });
}

function enableDdev(cb) {
  drushCommand = 'ddev drush';
  ddevStatus = true;
  cb();
}

function enableWatch(cb) {
  watchStatus = true;
  cb();
}

function watch(cb) {
  if (watchStatus) {
    gulp.watch(config.css.src, css);
  }
  else {
    cb();
  }
}

function splitPath(path) {
  var parts = path.split(/(\/|\\)/);
  if (!parts.length) return parts;
  return !parts[0].length ? parts.slice(1) : parts;
}

function testDir(parts) {
  if (parts.length === 0) return null;
  var p = parts.join('');
  var itdoes = fs.existsSync(path.join(p, '.ddev'));
  return itdoes ? p.slice(0, -1) : testDir(parts.slice(0, -1));
}

exports.default = series(drupal, exo, css);
exports.watch = series(drupal, enableWatch, exo, css, watch);

exports.ddev = series(enableDdev, drupal, exo, css);
exports.ddevWatch = series(enableWatch, enableDdev, drupal, exo, css, watch);
