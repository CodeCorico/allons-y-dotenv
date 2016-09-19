'use strict';

module.exports = function($allonsy) {
  $allonsy.outputInfo('► env:\n');

  var dotenv = require('dotenv'),
      path = require('path'),
      fs = require('fs'),
      envFile = path.resolve('.env'),
      env = dotenv.parse(fs.readFileSync(envFile)),
      maxWidth = 0;

  Object.keys(env).forEach(function(key) {
    maxWidth = Math.max(key.length, maxWidth);
  });

  Object.keys(env).forEach(function(key) {
    $allonsy.output('  ' + key + (key.length < maxWidth ? Array(maxWidth - key.length + 1).join(' ') : '') + ' = ' + process.env[key], '\n');
  });
};
