var gulp = require('gulp');

var $$ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
  replaceString: /\bgulp[\-.]/,
  rename: {
    'gulp-minify-css': 'minifyCSS',
    'gulp-angular-templatecache': 'templateCache'
  }
});

var fs = require('fs');
var srcDir  = './src';
var destDir = './dist';

var config = {
  html: {
    src: srcDir + '/',
    dest: destDir + '/'
  },
  images: {
    src: srcDir + '/images',
    dest: destDir + '/assets/images'
  },
  sass: {
    src: srcDir + '/sass',
    dest: destDir + '/assets/css'
  },
  js: {
    src: srcDir + '/scripts',
    dest: destDir + '/assets/scripts'
  },
  font: {
    src: srcDir + '/fonts',
    dest: destDir + '/assets/fonts'
  }
};

// Handle CLI erros
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('connect', function() {
  $$.connect.server({
    root: destDir,
    port: 8042,
    livereload: true
  });
});

gulp.task('index', function () {
  return gulp.src(config.html.src + 'index.html')
  .pipe($$.rename('index.html'))
  .pipe(gulp.dest(config.html.dest))
  .pipe($$.connect.reload());
});

gulp.task('templates', function () {
  return gulp.src(srcDir + '/views/**/*')
    .pipe($$.templateCache({
      standalone: true
    })) 
    .pipe(gulp.dest(destDir + '/assets/scripts/'))
    .pipe($$.connect.reload());
});

gulp.task('sass', function() {
  return gulp.src(config.sass.src + '/*.scss')
  .pipe($$.sass())
  .on('error', $$.notify.onError("Error: <%= error.message %>"))
  .on('error', handleError)
  .pipe($$.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))    .pipe($$.minifyCSS())
  .pipe(gulp.dest(config.sass.dest))
  .pipe($$.connect.reload());
});

gulp.task('font', function () {
  return gulp.src(config.font.src + '/**/*')
  .pipe(gulp.dest(config.font.dest))
  .pipe($$.connect.reload());
});

gulp.task('javascript', function () {
  return gulp.src($$.mainBowerFiles().concat(config.js.src + '/**/*.js'))
    .pipe($$.concat('all.js'))
    .pipe(gulp.dest(config.js.dest))
    .pipe($$.connect.reload());
});

gulp.task('images', function () {
  return gulp.src(config.images.src + '/**/*')
  .pipe($$.imagemin())
  .pipe(gulp.dest(config.images.dest))
  .pipe($$.connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(config.sass.src + '/*.scss', ['sass']);
  gulp.watch(config.js.src + '/**/*.js', ['javascript']);
  gulp.watch(config.html.src + 'index.html', ['index']);
  gulp.watch(config.images.src + '/*', ['images']);
  gulp.watch(config.html.src + '/views/**/*.html', ['templates']);
});

gulp.task('build', ['index', 'templates', 'sass', 'images', 'javascript', 'font']);

gulp.task('default', ['build'], function() {
  gulp.start('connect', 'watch');
});

gulp.task('compress', ['images']);
