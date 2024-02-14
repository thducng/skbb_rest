const express = require('express');
const api = require('./api');
const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/api', api);

app.get('/', (req, res) => {
    return res.send(`
    <div><span>Hej<span><div>
    `)
});


app.listen(
    PORT,
    () => console.log('Running on http://localhost:' + PORT)
);