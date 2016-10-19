var gulp = require('gulp'),
    handlebars = require('gulp-compile-handlebars'),
    rename = require('gulp-rename'),
    templateData = require('./templateConfig.js'),
    watch = require('gulp-watch'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    browserSync = require("browser-sync").create(),
    gutil = require('gulp-util'),
    buffer = require('vinyl-buffer');

//my tasks
gulp.task('sass', function() {
    return gulp.src("./dev/scss/app.scss")
        .pipe(sass())
        .pipe(cssnano())
        .pipe(gulp.dest("./assets/css"))
        .pipe(browserSync.stream());
});

gulp.task('build', function () {
  browserify({
    entries: './dev/js/components/Main.jsx',
    extensions: ['.jsx'],
    debug: true
  })
  .transform(babelify, {presets: ["es2015", "react"]})
  .bundle()
  .pipe(source('app.js'))
  .pipe(buffer())
  /*.pipe(uglify())*/
  .pipe(gulp.dest('./public/assets/js'));
});

gulp.task('serve', function() {
  browserSync.init({
        server: "./public"
    });
});

gulp.task('run', ['build', 'sass', 'serve'], function() { 

  //move images as well
  gulp.src("./dev/images/*.*")
  .pipe(gulp.dest('./assets/images'));
  
  //watch files and perform propper actions
  gulp.watch("./dev/scss/*.scss", ['sass']);
  gulp.watch("./dev/js/**/*.jsx", ['build']);
  gulp.watch("./public/*.html").on('change', browserSync.reload);
});
//end my tasks

gulp.task('moveAssetsforLocal', function(){
  gulp.src('./assets/**/*.*')
  .pipe(watch('./assets/**/*.*'))
  .pipe(gulp.dest('public/assets'));
  gulp.src('./dist/public/**/*.*')
  .pipe(watch('./dist/public/**/*.*'))
  .pipe(gulp.dest('public'));
});
gulp.task('default', ['run', 'moveAssetsforLocal'], function () {

	var options = {
		ignorePartials: true,
    compile: {
      noEscape: true
    },
		helpers : {
			capitals : function(str){
				//return str.toUpperCase();
				return str;
			},
      rawhelper : function(options) {
        return options.fn();
      },
      addTimestamp : function (){
        return Date.now()
      }
		}
	};
  templateData.IMP_SDK_URL += Date.now();
	return gulp.src(['dist/templates/**/*.hbs', '!dist/templates/**/partials/*.*', 'dist/templates/**/*.html'])
    .pipe(watch(['dist/templates/**/*.hbs', '!dist/templates/**/partials/*.*',' dist/templates/**/*.html']))
		.pipe(handlebars(templateData, options))
		.pipe(rename(function (path) {
    		path.extname = ".html"
  		}))
		.pipe(gulp.dest('./public'));

});
