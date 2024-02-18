const express = require('express');
require('./mongodb');
const router = express();

const profiles = require('./endpoints/profiles');
const users = require('./endpoints/users');
const foundations = require('./endpoints/foundations');
const courses = require('./endpoints/courses');
const levels = require('./endpoints/levels');
const events = require('./endpoints/events');

router.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to Specifik Kidz Breakverse REST-API'});
});
router.use('/profiles', profiles);
router.use('/users', users);
router.use('/foundations', foundations);
router.use('/courses', courses);
router.use('/levels', levels);
router.use('/events', events);

router.get('/debug', async () => {});

module.exports = router;