//npm install gulp
//npm install gulp-sass gulp-uglify gulp-cssnano gulp-concat browser-sync --save-dev 

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create();

// Start browserSync server
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
          baseDir: 'public_html'
        }
    });
});

gulp.task('scripts', function() {
    gulp.src(['src/scripts/jquery-1.11.1.min.js', 'src/scripts/*.js', ])
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('public_html/js'))
        .pipe(browserSync.reload({ // Reloading with Browser Sync
            stream: true
        }));
});

gulp.task('styles', function() {
    gulp.src(['src/styles/main.scss'])
        .pipe(sass())
        .pipe(cssnano())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('public_html/css'))
        .pipe(browserSync.reload({ // Reloading with Browser Sync
            stream: true
        }));
});

gulp.task('watch', ['browserSync'], function() {
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/styles/**/*.scss', ['styles']);
});

gulp.task('default', function() {
    gulp.run('scripts', 'styles', 'browserSync', 'watch');
});