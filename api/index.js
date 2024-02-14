const express = require('express');
const router = express();

const profiles = require('./endpoints/profiles');
const users = require('./endpoints/users');
const foundations = require('./endpoints/foundations');
const courses = require('./endpoints/courses');
const levels = require('./endpoints/levels');

router.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to Specifik Kidz Breakverse REST-API'});
});
router.use('/profiles', profiles);
router.use('/users', users);
router.use('/foundations', foundations);
router.use('/courses', courses);
router.use('/levels', levels);

module.exports = router;