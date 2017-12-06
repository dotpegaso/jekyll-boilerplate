const gulp 			= require('gulp'),
	  sass 			= require('gulp-sass'),
	  autoprefixer 	= require('gulp-autoprefixer'),
	  wait 			= require('gulp-wait'),
	  imagemin 		= require('gulp-imagemin'),
	  rename	 	= require('gulp-rename'),
	  cssmin 		= require('gulp-cssmin'),
	  browserSync 	= require('browser-sync').create(),
	  child         = require('child_process'),
      gutil         = require('gulp-util'),
      siteRoot      = '_site';


gulp.task('sass', function() {
    return gulp.src('./_sass/main.scss')
        .pipe(wait(500))
        .pipe(sass())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 4 versions', '> 5%', 'Firefox ESR']
        }))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./assets/'))
        .pipe(browserSync.stream());
});

gulp.task('sass-watch', ['sass'], function() {
    gulp.watch('./_sass/**/*.scss', ['sass'])
});


gulp.task('res', function() {
    gulp.src(['./res/*.jpg', './res/*.png', './res/*.svg'])
        .pipe(imagemin())
        .pipe(gulp.dest('./res/'));
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 8082,
    server: {
      baseDir: siteRoot
    }
  });
});

gulp.task('default', ['sass-watch', 'res', 'jekyll', 'serve']);