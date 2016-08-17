'use strict';

module.exports = function($done) {
  var fs = require('fs'),
      dotenv = require('dotenv');

  if (!fs.existsSync('.env')) {
    return $done(new Error('Your environnement is not configured. Please use: "node allons-y env"'));
  }

  dotenv.load();

  $done();
};
