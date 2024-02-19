const express = require('express');
const api = require('./api');
const app = express();
const PORT = process.env.PORT || 8080;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.json());

app.use('/api', api);

app.listen(
    PORT,
    () => console.log('Running on PORT: ' + PORT)
);