const express = require('express');
const { addExp } = require('../lib/level');
const { sanitizeValue } = require('../lib/sanitizeValue');
const router = express();

const Profile = require('../models/profile.model');
const File = require('../models/file.model');
const Progression = require('../models/progression.model');
const Feedback = require('../models/feedback.model');

const validProfileTypes = [
    'GUEST',
    'BREAKER',
    'INSTRUCTOR',
    'STUDENT',
    'ADMIN'
]

router.get('/', async (req, res) => {
    const profiles = await Profile.find({}).lean();
    return res.json(profiles);
});

router.get('/:id', async (req, res) => {
    const profile = await Profile.findOne({ id: req.params.id }).lean();
    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    const { foundations = [], missions = [] } = await Progression.findOne({ profileId: profile.id }).lean() || {};
    const feedbacks = await Feedback.find({ profileId: profile.id }).lean();

    return res.json({
        ...profile,
        foundations,
        missions,
        feedbacks
    });
});

router.get('/:id/files', async (req, res) => {
    const files = await File.find({ profileId: req.params.id }).lean();
    return res.json(files);
});


router.get('/:id/videos', async (req, res) => {
    const videos = await File.find({ profileId: req.params.id, contentType: { $in: ["video/mp4"]} }).lean();
    return res.json(videos);
});


router.post('/:id/addExp', async (req, res) => {
    const { exp } = req.body;
    const profile = await Profile.findOne({ id: req.params.id }).lean();

    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    if(!exp) {
        return res.json({ error: { message: "Missing exp", body: req.params }});
    }


    const newProfile = await addExp(profile, exp);
    return res.json(newProfile);
});

router.post('/:id/delete', async (req, res) => {
    // Check on admin user or actual user id
    const profile = await Profile.findOne({ id: req.params.id });

    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    profile.deletedAt = new Date();
    const newProfile = await profile.save();
    return res.json(newProfile.toObject());
});

router.post('/:id/update', async (req, res) => {
    const { type } = req.body;
    const profile = await Profile.findOne({ id: req.params.id });

    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    const keys = [ "image", "crew", "school", "type", "name", "birthday"];
    for (let idx = 0; idx < keys.length; idx++) {
        const key = keys[idx];
        profile[key] = sanitizeValue(req.body[key], profile[key]);
    }
    profile.deletedAt = null;

    if(type) {
        if(!validProfileTypes.includes(type)) {
            return res.json({ error: { message: "Invalid profile type", body: req.params }});
        }
        profile.type = type || profile.type;
    }

    const newProfile = await profile.save();
    return res.json(newProfile.toObject());
});

module.exports = router;