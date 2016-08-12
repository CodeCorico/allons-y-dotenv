'use strict';

module.exports = function(allonsy, options, callback) {
  var fs = require('fs'),
      dotenv = require('dotenv');

  if (!fs.existsSync('.env')) {
    return callback(new Error('Your environnement is not configured. Please use: "node allons-y env"'));
  }

  dotenv.load();

  callback();
};
