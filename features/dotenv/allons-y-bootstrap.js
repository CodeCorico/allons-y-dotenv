'use strict';

var path = require('path');

module.exports = {
  bootstrap: require(path.resolve(__dirname, 'dotenv-bootstrap.js')),
  commands: {
    env: {
      help: [
        ['env', 'configure your local platform environment']
      ],
      command: require(path.resolve(__dirname, 'dotenv-env.js'))
    }
  }
};
