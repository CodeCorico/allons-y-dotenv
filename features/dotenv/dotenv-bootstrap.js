'use strict';

module.exports = function($allonsy, $done) {
  var fs = require('fs'),
      dotenv = require('dotenv');

  if (!fs.existsSync('.env')) {
    return $done(new Error('Your environnement is not configured. Please use: "node allons-y env"'));
  }

  $allonsy.log('allons-y-dotenv', 'dotenv-load');

  dotenv.load();

  $done();
};
