
var gulp = require('gulp')
var webpack = require('webpack')
var wpConf = require('./webpack.config.js')
var gutil = require('gulp-util')

gulp.task('default', ['webpack'])

gulp.task('webpack', function (callback) {
  webpack(wpConf, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString({}))
    callback()
  })
})
