var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
    runSequence = require('run-sequence'),
    argv = process.argv,
    test = require('./test/test');

/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before', ['watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
gulp.task('build:before', ['build']);

// we want to 'watch' when livereloading
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var buildBrowserify = require('ionic-gulp-browserify-typescript');
var buildSass = require('ionic-gulp-sass-build');
var copyHTML = require('ionic-gulp-html-copy');
var copyFonts = require('ionic-gulp-fonts-copy');
var copyScripts = require('ionic-gulp-scripts-copy');

// This function copies our fonts to the build folder.
// Author: Dominik Skalnik, 5.5.2016
var copyDigitaleDoerferFonts = function(options) {
  options.src = options.src || 'resources/fonts/**/*.+(ttf|woff|woff2)';
  options.dest = options.dest || 'www/build/fonts';

  return gulp.src(options.src)
    .pipe(gulp.dest(options.dest));
};

var isRelease = argv.indexOf('--release') > -1;

gulp.task('watch', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts'],
    function(){
      gulpWatch('app/**/*.scss', function(){ gulp.start('sass'); });
      gulpWatch('app/**/*.html', function(){ gulp.start('html'); });
      buildBrowserify({ watch: true }).on('end', done);
    }
  );
});

gulp.task('build', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts'],
    function(){
      buildBrowserify({
        minify: isRelease,
        browserifyOptions: {
          debug: !isRelease
        },
        uglifyOptions: {
          mangle: false
        }
      }).on('end', done);
    }
  );
});

// Added by skaldo on 6.5.2016
// Testing tasks
gulp.task('test', test.karma);
gulp.task('karma-debug', test.karmaDebug);
gulp.task('lint', test.lint);

gulp.task('sass', buildSass);
gulp.task('html', copyHTML);
gulp.task('ionicFonts', copyFonts);
gulp.task('digitaleDoerferFonts', copyDigitaleDoerferFonts);
gulp.task('fonts', ['ionicFonts', 'digitaleDoerferFonts']);
gulp.task('scripts', copyScripts);
gulp.task('clean', function(){
  return del('www/build');
});
