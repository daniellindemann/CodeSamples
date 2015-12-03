// gulp needs to be installed as a global dependency
// npm install -g gulp
// npm install --save-dev gulp
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
var sp = require('gulp-spsync');

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

/*

configuration
-------------

1. goto [your site]/_layouts/15/appregnew.aspx
	save client id and client secret
2. goto [your site]/_layouts/15/appinv.aspx
	insert client id
	insert rights
	<AppPermissionRequests AllowAppOnlyPolicy="true">
		<AppPermissionRequest Scope="http://sharepoint/content/sitecollection/web" Right="FullControl"/>
	</AppPermissionRequests>
3. execute

(see https://github.com/wictorwilen/gulp-spsync/blob/master/README.md)

*/
gulp.task('makeSPFiles', ['compress'], function() {
	var spFolder = 'build/sp/Style Library/spdays05/js';
	return gulp.src(['build/js/**/*.js', 'js/**/*.html'])
		.pipe(gulp.dest(spFolder));
});

gulp.task('deployToSP', ['makeSPFiles'], function() {
	// copy files to sharepoint folder
	return gulp.src('build/sp/**/*.*')
		.pipe(sp({
			'client_id':'39232ca1-f6c1-477e-95fa-29b0d5756a2f',
			'client_secret':'9+d4/QJzU6L32pKMZ+tVSBBngEAnDXxeAb335+kHloQ=',
			'realm':'',
			'site':'https://dlindemann.sharepoint.com/sites/publishing',
			'verbose':'true'
		}));
});

gulp.task('default', ['deployToSP']);