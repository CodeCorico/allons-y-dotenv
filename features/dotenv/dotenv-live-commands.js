'use strict';

module.exports = function($allonsy) {
  $allonsy.logInfo('\n► env:\n\n');

  var dotenv = require('dotenv'),
      path = require('path'),
      fs = require('fs');

  var envFile = path.resolve(__dirname, '../../../../.env'),
      env = dotenv.parse(fs.readFileSync(envFile)),
      maxWidth = 0;

  Object.keys(env).forEach(function(key) {
    maxWidth = Math.max(key.length, maxWidth);
  });

  Object.keys(env).forEach(function(key) {
    console.log('  ' + key + (key.length < maxWidth ? Array(maxWidth - key.length + 1).join(' ') : '') + ' = ' + process.env[key]);
  });

  console.log('');
};
