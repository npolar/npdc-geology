var task = function(gulp, config) {
  'use strict';

  var runSequence = require('run-sequence').use(gulp);

  gulp.task('build', function(cb) {
    global.isProd = false;
    runSequence(['clean', 'info'], 'devCommon', 'lint', 'test', cb);
  });
};

module.exports = task;
