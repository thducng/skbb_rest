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
    const { email, password, name, lastname, zip, city } = req.body;
    const user = await User.findOne({ email }).lean();

    if(user) {
        return res.json({ error: { message: "Email is already in use", body: req.body }});
    }
    if(!email || !password || !name || !lastname || !zip || !city) {
        return res.json({ 
            error: { message: "Missing values is already in use", 
            body: { 
                email: email || 'missing', 
                password: password || 'missing', 
                name: name || 'missing', 
                lastname: lastname || 'missing', 
                zip: zip || 'missing', 
                city: city || 'missing',
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
        status: "WAITING" 
    }).save();
    return res.json(newUser.toObject());
});

module.exports = router;