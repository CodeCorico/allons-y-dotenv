'use strict';

module.exports = function($allonsy, $done) {

  var inquirer = require('inquirer'),
      dotenv = require('dotenv'),
      path = require('path'),
      fs = require('fs'),
      async = require('async'),
      extend = require('extend');

  $allonsy.outputBanner('Configure your Allons-y environment:\n\n');

  var envFiles = $allonsy.findInFeaturesSync('*-env.@(js|json)'),
      envFile = path.resolve('.env'),
      env = {};

  if (fs.existsSync(envFile)) {
    env = dotenv.parse(fs.readFileSync(envFile));
    Object.keys(env).forEach(function(key) {
      env[key] = env[key] == 'true' ? true : env[key];
      env[key] = env[key] == 'false' ? false : env[key];
    });
  }

  function _prompt(prompts, callback) {
    inquirer.prompt(prompts).then(function(values) {
      for (var item in values) {
        env[item] = values[item];
      }

      callback();
    });
  }

  function _formatWhen(prompt) {
    if (prompt.when && typeof prompt.when != 'function') {
      var whens = typeof prompt.when == 'string' ? [prompt.when] : prompt.when;

      delete prompt.when;

      whens = whens
        .map(function(when) {
          if (typeof when == 'function') {
            return when;
          }

          when = when.split('=');

          if (when.length > 1) {
            when[0] = when[0].trim();
            when[1] = when[1].trim();

            if (when[0]) {
              return when;
            }
          }

          return null;
        })
        .filter(function(when) {
          return !!when;
        });

      if (whens.length) {
        prompt.when = function(inputs) {
          inputs = extend(extend({}, process.env), extend({}, env), inputs || {});

          var keys = Object.keys(inputs),
              trues = 0;

          for (var i = 0; i < whens.length; i++) {
            var when = whens[i];

            if (typeof when == 'function') {
              if (when(inputs)) {
                trues++;
              }
              else {
                return false;
              }

              continue;
            }

            for (var j = 0; j < keys.length; j++) {
              var key = keys[j];

              if (key == when[0]) {
                if (typeof inputs[key] == 'boolean') {
                  inputs[key] = inputs[key] ? 'true' : 'false';
                }

                if (inputs[key] == when[1]) {
                  trues++;

                  if (trues === whens.length) {
                    return true;
                  }

                  break;
                }
              }
            }
          }

          return false;
        };
      }
    }
  }

  async.mapSeries(envFiles, function(file, nextFile) {
    var envConfig = require(path.resolve(file));

    if (typeof envConfig == 'function') {
      DependencyInjection.injector.controller.invoke(null, envConfig, {
        controller: {
          $env: function() {
            return env;
          },

          $inquirer: function() {
            return inquirer;
          },

          $dotenv: function() {
            return dotenv;
          },

          $done: function() {
            return function(prompts) {
              if (!prompts || !prompts.length) {
                return nextFile();
              }

              prompts.forEach(function(prompt) {
                _formatWhen(prompt);
              });

              _prompt(prompts, nextFile);
            };
          }
        }
      });

      return;
    }

    if (!envConfig.env || typeof envConfig.env != 'object' || !envConfig.env.length) {
      return nextFile();
    }

    envConfig.env.forEach(function(prompt) {
      if (typeof env[prompt.name] != 'undefined') {
        prompt.default = env[prompt.name];
      }

      _formatWhen(prompt);
    });

    _prompt(envConfig.env, nextFile);

  }, function() {
    fs.writeFileSync(envFile,
      '# Ignore this file in your repository\n\n' +
      Object.keys(env).map(function(key) {
        return key + '=' + env[key];
      }).join('\n')
    );

    $allonsy.outputSuccess('\n  Your environment is ready!');

    $done();
  });

};
