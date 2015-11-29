// gulp needs to be installed as a global dependency
// npm install -g gulp
// npm onstall --save-dev gulp
var gulp = require('gulp');

// install npm module gulp-uglify
// npm install --save-dev gulp-uglify
var uglify = require('gulp-uglify');

// install npm module gulp-rename
// npm install --save-dev gulp-rename
var rename = require('gulp-rename');

// install npm module gulp-replace
// npm install --save-dev gulp-replace
var replace = require('gulp-replace');

// install npm module gulp-spsync
// npm install --save-dev wictorwilen/gulp-spsync
var sp = require('gulp-spsync')

// tasks to minify js files
gulp.task('compress', function() {
	return gulp.src('js/*.debug.js')
		.pipe(uglify())
		.pipe(replace('.debug', ''))
		.pipe(rename(function(path) {
			path.basename = path.basename.replace('.debug', '');
		}))
		.pipe(gulp.dest('build/js'));
});

gulp.task('deployToSP', ['compress'], function() {
	var spFolder = 'publishing/spdays05/Style Library/demo05/js';
	
	// copy files to sharepoint folder
	return gulp.src(['build/js/**/*.js', 'js/**/*.html'])
		.pipe(gulp.dest(spFolder))
});

gulp.task('default', ['compress']);