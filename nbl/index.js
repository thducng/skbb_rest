const express = require('express');
const fs = require('fs');
require('./mongodb');
const router = express();

const users = require('./users');
const registrations = require('./registrations');

/**
 * GET /nbl
 * @summary This is the main API endpoint
 */
router.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to Nordic Break League REST-API v1'});
});
router.use('/users', users);
router.use('/registrations', registrations);

router.use('/images', (req, res) => {
    fs.readdir('images', (err, files) => {
        const images = [];
        files.forEach(file => {
            images.push('/images/' + file);
        });

        res.json(images);
      });
});

router.get('/debug', async () => {});

module.exports = router;