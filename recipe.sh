#!/bin/bash
mkdir "$1"
cd "$1"
touch .gitignore

cat <<PACKAGE_END > package.json
{
  "description": "$1 recipe",
  "devDependencies": {
    "gulp": "^3.8.7",
    "gulp-util": "^3.0.0",
    "run-sequence": "^0.3.6"
  }
}

PACKAGE_END

cat <<GULPFILE_END > gulpfile.js
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	run = require('run-sequence');

gulp.task('default', function (callback) {
	gutil.log(gutil.colors.blue('Default task running in sass-compilation recipe'));
	callback();
});

GULPFILE_END

cat <<README_END > README.md
# $1 recipe

## Description

## Examples

## Modules & Packages

The links below are for additional documentation on the [npm](https://www.npmjs.org/) packages used in this recipe.

* [https://www.npmjs.org/package/gulp](https://www.npmjs.org/package/gulp)
* [https://www.npmjs.org/package/gulp-util](https://www.npmjs.org/package/gulp-util)
* [https://www.npmjs.org/package/run-sequence](https://www.npmjs.org/package/run-sequence)



README_END

npm install