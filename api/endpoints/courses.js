const express = require('express');
const router = express();

const data = require('../db/courses.json');
const historyData = require('../db/courseHistory.json');

router.get('/', (req, res) => {
    return res.json(data.map((course) => {
        const attendants = historyData.filter((i) => i.courseId === course.id);
        return { ...course, attendants };
    }));
});

router.get('/:id', (req, res) => {
    const course = data.find((i) => i.id === req.params.id)

    if(!course) {
        return res.json({ error: { message: "Course doesn't exists", body: req.params }});
    }

    const attendants = historyData.filter((i) => i.courseId === course.id);
    return res.json({ ...course, attendants });
});

router.get('/history/:id', (req, res) => {
    return res.json(historyData.filter((i) => i.profileId === req.params.id));
});

module.exports = router;