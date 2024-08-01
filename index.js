const server = require('./server');

server.listen(
    PORT,
    () => console.log('Running on PORT: ' + PORT)
);