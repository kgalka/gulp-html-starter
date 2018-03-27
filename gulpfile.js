'use strict';

var gulp         = require('gulp'),
    sass         = require('gulp-ruby-sass'),
    rename       = require("gulp-rename"),
    uglify       = require('gulp-uglify'),
    browserSync  = require('browser-sync').create(),
    sourcemaps   = require('gulp-sourcemaps'),
    clean        = require('gulp-clean'),
    autoprefixer = require('gulp-autoprefixer'),
    include      = require('gulp-include'),
    fileinclude  = require('gulp-file-include'),
    gutil        = require('gulp-util'),
    cleanCSS     = require('gulp-clean-css'),
    ftp          = require('vinyl-ftp');

/**
 * Default task - 'gulp' command
 */
gulp.task('default', ['serve']);

/**
 * Static Server + watching source files
 */
gulp.task('serve', ['files', 'sass', 'scripts'], function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
    gulp.watch("./src/sass/**/*", ['sass']);
    gulp.watch(['./src/images/*', './src/*.html'], ['files']);
    gulp.watch('./src/js/*', ['scripts']);
    gulp.watch(['dist/*.html', 'dist/js/*.js']).on('change', function () {
        setTimeout(function () {
            browserSync.reload();
        }, 100);
    });
});

/**
 * Compile with gulp-ruby-sass + source maps
 */
gulp.task('sass', function () {
    return sass('./src/sass/main.scss', {sourcemap: true})
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: './src/sass'
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

/**
 * Add js scripts
 */
gulp.task('scripts', function() {
    gulp.src(['./src/js/main.js'])
        .pipe(sourcemaps.init())
            .pipe(include())
        .pipe(sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: './src/js'
        }))
        .pipe(gulp.dest('./dist/js'))
});

/**
 * Copy html & other files to dist directory
 */
gulp.task('files', function() {
    gulp.src('./src/*.*')
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(gulp.dest('./dist/'));
    gulp.src('./src/images/**/*')
        .pipe(gulp.dest('./dist/images'));
    gulp.src('./src/js/**/*')
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('compress', function () {
    gulp.src('./dist/js/main.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/js'))

    gulp.src('./dist/css/main.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/css'));

});

/**
 * Clean dist directory
 */
gulp.task('clean', function() {
    gulp.src(['./dist'])
        .pipe(clean({force : true}));
});

/**
 * Deployment task using vinyl-ftp
 */
gulp.task('deploy', function() {
    var conn = ftp.create( {
        host:     '',
        user:     '',
        password: '',
        parallel: 1,
        log:      gutil.log
    });
    var globs = [
            'dist/**',
    ];
    return gulp.src( globs, { base: './dist', buffer: false } )
        // .pipe( conn.newer( '/' ) ) // only upload newer files
        .pipe( conn.dest( '/' ) );
});
