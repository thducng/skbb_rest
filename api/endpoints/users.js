const express = require('express');
const { v4 } = require('uuid');
const router = express();

const Profile = require('../models/profile.model');
const User = require('../models/user.model');

router.get('/', async (req, res) => {
    const users = await User.find({}).lean();
    const profiles = await Profile.find({ userId: { $in: users.map((i) => i.id) }}).lean()

    return res.json(users.map((user) => {
        return { ...user, profiles: user.profiles.map((id) => profiles.find((i) => i.id === id))};
    }));
});

router.get('/:id', async (req, res) => {
    const user = await User.findOne({ id: req.params.id }).lean();

    if(!user) {
        return res.json({ error: { message: "User doesn't exists", body: req.body }});
    }

    const profiles = await Profile.find({ userId: req.params.id }).lean();
    return res.json({ ...user, profiles });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password }).lean();

    if(!user) {
        return res.json({ error: { message: "User doesn't exists", body: req.body }});
    }

    const profiles = await Profile.find({ userId: user.id }).lean();
    return res.json({ ...user, profiles });
});

router.post('/signup', async (req, res) => {
    const { email, password, name, lastname, zip, city, terms } = req.body;
    const user = await User.findOne({ email }).lean();

    if(user) {
        return res.json({ error: { message: "Email is already in use", body: req.body }});
    }
    if(!email || !password || !name || !lastname || !zip || !city || !terms) {
        return res.json({ 
            error: { message: "Missing values", 
            body: { 
                email: email || 'missing', 
                password: password || 'missing', 
                name: name || 'missing', 
                lastname: lastname || 'missing', 
                zip: zip || 'missing', 
                city: city || 'missing',
                terms: terms ? new Date() : 'missing'
            } 
        }});
    }

    const newUser = await new User({ 
        id: v4(), 
        email, 
        password, 
        name, 
        lastname, 
        zip, 
        city, 
        profiles: [], 
        active: true, 
        status: "WAITING",
        terms: new Date()
    }).save();
    return res.json(newUser.toObject());
});

router.post('/:id/createProfile', async (req, res) => {
    const { userId, name, age, crew, school, image } = req.body;
    const profile = await Profile.findOne({ userId, name }).lean();

    if(profile) {
        return res.json({ error: { message: "Name is already in use", body: req.body }});
    }
    if(!userId || !name || !age || !image) {
        return res.json({ 
            error: { message: "Missing values", 
            body: { 
                userId: userId || 'missing', 
                name: name || 'missing', 
                age: age || 'missing', 
                image: image || 'missing'
            } 
        }});
    }

    const newProfile = await new Profile({ 
        id: v4(),
        userId, 
        name, 
        age, 
        crew, 
        school, 
        image,
        active: true
    }).save();
    return res.json(newProfile.toObject());
});

module.exports = router;