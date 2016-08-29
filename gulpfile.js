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
    fileinclude  = require('gulp-file-include');

/**
 * Static Server + watching scss/html files
 */
gulp.task('serve', ['files', 'sass', 'scripts'], function() {

    browserSync.init({
        server: "./dist/"
    });

    gulp.watch("./src/sass/**/*", ['sass']);
    // gulp.watch("./src/sass/blocks/*.scss", ['sass']);
    // gulp.watch("./src/js/*.js", ['scripts']);
    gulp.watch("./src/**/*", ['files', 'sass', 'scripts']);
    // gulp.watch("./src/images/**/*", ['files']);
    // gulp.watch("./src/photos/**/*", ['files']);
    gulp.watch("./src/*.html").on('change', browserSync.reload);
    gulp.watch("./src/partials/*.html").on('change', browserSync.reload);
});

/**
 * Compile with gulp-ruby-sass + source maps
 */
gulp.task('sass', function () {
    return sass('./src/sass/main.scss', {sourcemap: true})
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(autoprefixer({
            // browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: './src/sass'
        }))
        .pipe(browserSync.stream({match: '**/*.css'}))
        .pipe(gulp.dest('./dist/css'));     
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
    gulp.src('./src/photos/**/*')
        .pipe(gulp.dest('./dist/photos'));          
    gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'));            
});

/**
 * Clean dist directory 
 */
gulp.task('clean', function() {
    gulp.src(['./dist'])
        .pipe(clean({force : true}));
});

gulp.task('default', ['serve']);