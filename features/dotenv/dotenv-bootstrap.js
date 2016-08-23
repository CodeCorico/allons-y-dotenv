'use strict';

module.exports = function($allonsy, $options, $done) {
  var dotenv = require('dotenv');

  $allonsy.log('allons-y-dotenv', 'dotenv-load');

  dotenv.load({
    silent: true
  });

  $done();
};
