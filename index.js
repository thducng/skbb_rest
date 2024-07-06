const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const api = require('./api');
const app = express();
const PORT = process.env.PORT || 8080;
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
    filesPattern: './api/**.js',
    baseDir: __dirname
  };
expressJSDocSwagger(app)(options);

app.use(cors(corsOpts));
app.use(express.json());

app.use('/api', api);
app.use('/images', express.static('images'));

app.listen(
    PORT,
    () => console.log('Running on PORT: ' + PORT)
);