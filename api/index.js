const express = require('express');
const fs = require('fs');
require('./mongodb');
const router = express();

const profiles = require('./endpoints/profiles');
const users = require('./endpoints/users');
const foundations = require('./endpoints/foundations');
const combos = require('./endpoints/combos');
const missions = require('./endpoints/missions');
const feedbacks = require('./endpoints/feedbacks');
const courses = require('./endpoints/courses');
const levels = require('./endpoints/levels');
const events = require('./endpoints/events');
const videos = require('./endpoints/videos');

/**
 * GET /api
 * @summary This is the main API endpoint
 */
router.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to Specifik Kidz Breakverse REST-API v4'});
});
router.use('/profiles', profiles);
router.use('/users', users);
router.use('/foundations', foundations);
router.use('/combos', combos);
router.use('/missions', missions);
router.use('/feedbacks', feedbacks);
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