'use strict';

var gulp = require('gulp'),
	conventionalChangelog = require('gulp-conventional-changelog');

gulp.task('changelog', function () {
	return gulp.src('CHANGELOG.md', {
		buffer: false
	})
		.pipe(conventionalChangelog({
			preset: 'angular'
		}))
		.pipe(gulp.dest('./'));
});
