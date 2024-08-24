const PORT = process.env.PORT || 8080;
const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const api = require('./api');
const nbl = require('./nbl');
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
server.use('/nbl', nbl);
server.use('/images', express.static('images'));

module.exports = server;

server.listen(
    PORT,
    () => console.log('Running on PORT: ' + PORT)
);