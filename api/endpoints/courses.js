const express = require('express');
const router = express();

const Course = require('../models/course.model');
const CourseHistory = require('../models/courseHistory.model');

router.get('/', async (req, res) => {
    const courses = await Course.find({}).lean();
    return res.json(courses);
});

router.get('/:id', async (req, res) => {
    const course = await Course.findOne({ id: req.params.id }).lean();

    if(!course) {
        return res.json({ error: { message: "Course doesn't exists", body: req.params }});
    }

    const history = await CourseHistory.find({ courseId: course.id }).lean();
    return res.json({ ...course, history });
});

module.exports = router;