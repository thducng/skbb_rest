const express = require('express');
const { addExp } = require('../lib/level');
const router = express();

const Profile = require('../models/profile.model');
const File = require('../models/file.model');

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
    return res.json(profile);
});

router.get('/:id/files', async (req, res) => {
    const files = await File.find({ profileId: req.params.id }).lean();
    return res.json(files);
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

router.get('/:id/delete', async (req, res) => {
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
    const { image, crew, school, type, name, birthday } = req.body;
    const profile = await Profile.findOne({ id: req.params.id });

    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    profile.image = image || profile.image;
    profile.crew = crew || profile.crew;
    profile.school = school || profile.school;
    profile.name = name || profile.name;
    profile.birthday = birthday || profile.birthday;
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