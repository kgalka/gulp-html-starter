'use strict';

var gulp         = require('gulp'),
    sass         = require('gulp-ruby-sass'),
    cleanCSS     = require('gulp-clean-css'),
    htmlmin      = require('gulp-htmlmin'),
    rename       = require('gulp-rename'),
    uglify       = require('gulp-uglify'),
    browserSync  = require('browser-sync').create(),
    sourcemaps   = require('gulp-sourcemaps'),
    clean        = require('gulp-clean'),
    autoprefixer = require('gulp-autoprefixer'),
    include      = require('gulp-include'),
    fileinclude  = require('gulp-file-include'),
    gutil        = require('gulp-util'),
    ftp          = require('vinyl-ftp');
/**
 * Static Server + watching scss/html files
 */
gulp.task('serve', ['files', 'sass', 'scripts'], function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
    gulp.watch("./src/sass/**/*", ['sass']);
    gulp.watch(['./images/*', './photos/*', './fonts/*', './src/*.html', './src/partials/*.html'], ['files']);
    gulp.watch('./src/js/*', ['scripts']);
    gulp.watch(['dist/*.html', 'dist/js/*.js']).on('change', browserSync.reload);
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

    gulp.src('./src/.htaccess')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('compress', function () {
    gulp.src('dist/js/*.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/js'));

    gulp.src('dist/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));

    gulp.src('dist/css/*.css')
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

gulp.task('default', ['serve']);

/**
 * Deployment task using vinyl-ftp
 */
gulp.task('deploy', function() {
    var conn = ftp.create( {
        host:     'host-name',
        user:     'user-name',
        password: 'password',
        parallel: 10,
        log:      gutil.log
    });
    var globs = [
            'dist/**',
    ];
    return gulp.src( globs, { base: './dist', buffer: false } )
        // .pipe( conn.newer( '/html' ) ) // only upload newer files
        .pipe( conn.dest( '/html' ) );
});
