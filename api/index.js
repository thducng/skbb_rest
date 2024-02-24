const express = require('express');
const fs = require('fs');
require('./mongodb');
const router = express();

const profiles = require('./endpoints/profiles');
const users = require('./endpoints/users');
const foundations = require('./endpoints/foundations');
const courses = require('./endpoints/courses');
const levels = require('./endpoints/levels');
const events = require('./endpoints/events');
const videos = require('./endpoints/videos');


router.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to Specifik Kidz Breakverse REST-API'});
});
router.use('/profiles', profiles);
router.use('/users', users);
router.use('/foundations', foundations);
router.use('/courses', courses);
router.use('/levels', levels);
router.use('/events', events);
router.use('/videos', videos);

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