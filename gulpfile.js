var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var concat = require('gulp-concat');

// Static Server + watching scss/html files
gulp.task('serve', ['files', 'sass', 'scripts'], function() {

    browserSync.init({
        server: "./dist/"
    });

    gulp.watch("./src/sass/*.scss", ['sass']);
    gulp.watch("./src/sass/views/*.scss", ['sass']);
    gulp.watch("./src/sass/organisms/*.scss", ['sass']);
    gulp.watch("./src/*.html").on('change', browserSync.reload);
});

/**
 * Compile with gulp-ruby-sass + source maps
 */
gulp.task('sass', function () {
    return sass('./src/sass/main.scss', {sourcemap: true})
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: './src/sass'
        }))
        .pipe(browserSync.stream({match: '**/*.css'}))
        .pipe(gulp.dest('./dist/css'));     
});

/**
 * Concatenate js scripts
 */

gulp.task('scripts', function() {
    gulp.src(['./src/js/jquery-2.1.3.min.js', 
              './src/js/modernizr.custom.js', 
              './src/js/main.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./dist/js'))
});

/**
 * Copy html & other files to dist directory
 */
gulp.task('files', function() {
    gulp.src('./src/*.*')
        .pipe(gulp.dest('./dist/'));   
});

/**
 * Clean dist directory 
 */
gulp.task('clean', function() {
    gulp.src(['./dist'])
        .pipe(clean({force : true}));
});

gulp.task('default', ['serve']);