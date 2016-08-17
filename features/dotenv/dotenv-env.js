'use strict';

module.exports = function($allonsy, $done) {
var inquirer = require('inquirer'),
    dotenv = require('dotenv'),
    path = require('path'),
    fs = require('fs'),
    async = require('async');


  $allonsy.logBanner('Configure your Allons-y! platform environment:\n');

  var envFiles = $allonsy.findInFeaturesSync('*-env.json'),
      envFile = path.resolve(__dirname, '../../../../.env'),
      env = {};

  if (fs.existsSync(envFile)) {
    env = dotenv.parse(fs.readFileSync(envFile));
    Object.keys(env).forEach(function(key) {
      env[key] = env[key] == 'true' ? true : env[key];
      env[key] = env[key] == 'false' ? false : env[key];
    });
  }

  async.mapSeries(envFiles, function(file, nextFile) {
    var envConfig = require(path.resolve(file));

    if (!envConfig.env || typeof envConfig.env != 'object' || !envConfig.env.length) {
      return nextFile();
    }

    envConfig.env.map(function(prompt) {
      if (typeof env[prompt.name] != 'undefined') {
        prompt.default = env[prompt.name];
      }
    });

    inquirer.prompt(envConfig.env).then(function(values) {
      for (var item in values) {
        env[item] = values[item];
      }

      nextFile();
    });

  }, function() {
    fs.writeFileSync(envFile, Object.keys(env).map(function(key) {
      return key + '=' + env[key];
    }).join('\n'));

    $allonsy.logTitle('Your platform environment is ready!');
  });

  $done();
};
