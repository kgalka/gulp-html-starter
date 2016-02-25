var gulp         = require('gulp'),
    sass         = require('gulp-ruby-sass'),
    rename       = require("gulp-rename"),
    uglify       = require('gulp-uglify'),
    browserSync  = require('browser-sync').create(),
    sourcemaps   = require('gulp-sourcemaps'),
    clean        = require('gulp-clean'),
    concat       = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer');

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
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
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
 * Concatenate js scripts
 */

gulp.task('scripts', function() {
    gulp.src(['./src/js/jquery-2.2.1.js', 
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