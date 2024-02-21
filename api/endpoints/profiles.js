const express = require('express');
const { addExp } = require('../lib/level');
const router = express();

const Profile = require('../models/profile.model');

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

router.post('/:id/addExp', async (req, res) => {
    const { exp } = req.body;
    const profile = await Profile.findOne({ id: req.params.id }).lean();

    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    const newProfile = await addExp(profile, exp);
    return res.json(newProfile);
});

router.post('/:id/updateImage', async (req, res) => {
    const { id, image } = req.body;
    const profile = await Profile.findOne({ id: req.params.id });

    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    profile.image = id;
    const newProfile = await profile.save();
    return res.json(newProfile);
});

module.exports = router;