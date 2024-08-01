const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const api = require('./api');
const server = express();
const cors = require('cors');

const corsOpts = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}

const options = {
    info: {
      version: '1.0.0',
      title: 'Specifik Kidz Breakverse',
      license: {
        name: 'MIT',
      },
    },
    filesPattern: './**/*.js',
    baseDir: __dirname
  };
expressJSDocSwagger(server)(options);

server.use(cors(corsOpts));
server.use(express.json());

server.use('/api', api);
server.use('/images', express.static('images'));

module.exports = server;