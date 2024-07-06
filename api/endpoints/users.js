const express = require('express');
const { v4 } = require('uuid');
const { sanitizeValue } = require('../lib/sanitizeValue');
const router = express();

const Profile = require('../models/profile.model');
const User = require('../models/user.model');

const validUserTypes = [
    'USER',
    'ADMIN'
];

/**
 * GET /api/users
 * @summary GET all users
 * @tags Users
 * @return {array<User>} 200 - Success Response
 */
router.get('/', async (req, res) => {
    const users = await User.find({}).lean();
    const profiles = await Profile.find({ userId: { $in: users.map((i) => i.id) }, deletedAt: null }).lean()

    return res.json(users.map((user) => {
        return { ...user, profiles: user.profiles.map((id) => profiles.find((i) => i.id === id))};
    }));
});

/**
 * GET /api/users/{id}/delete
 * @summary GET a specific user
 * @tags Users
 * @param {string} id.path - User id
 * @return {User} 200 - Success Response
 */
router.get('/:id', async (req, res) => {
    const user = await User.findOne({ id: req.params.id }).lean();

    if(!user) {
        return res.json({ error: { message: "User doesn't exists", body: req.body }});
    }

    const profiles = await Profile.find({ userId: req.params.id, deletedAt: null }).lean();
    return res.json({ ...user, profiles });
});

/**
 * POST /api/users/{id}/delete
 * @summary DELETE a specific user
 * @tags Users
 * @param {string} id.path - User id
 * @return {User} 200 - Success Response
 */
router.post('/:id/delete', async (req, res) => {
    // Check on admin user
    const user = await User.findOne({ id: req.params.id });

    if(!user) {
        return res.json({ error: { message: "User doesn't exists", body: req.body }});
    }

    await Profile.updateMany({ userId: req.params.id, deletedAt: null }, { deletedAt: new Date() }).lean();
    user.deletedAt = new Date();
    const newUser = await user.save();
    const profiles = await Profile.find({ userId: req.params.id }).lean();
    return res.json({ ...newUser.toObject(), profiles });
});

/**
 * POST /api/users/signup
 * @summary LOGIN a specific user
 * @tags Users
 * @param {string} request.body.email.required - Email to login
 * @param {string} request.body.password.required - Password to login
 * @return {User} 200 - Success Response
 */

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: { $regex: new RegExp(email), $options: 'i' }, password }).lean();

    if(!user) {
        return res.json({ error: { message: "User doesn't exists", body: req.body }});
    }

    const profiles = await Profile.find({ userId: user.id }).lean();
    return res.json({ ...user, profiles });
});

/**
 * POST /api/users/signup
 * @summary CREATE a new user
 * @tags Users
 * @param {UserArgs} request.body.required - User info
 * @return {User} 200 - Success Response
 */
router.post('/signup', async (req, res) => {
    const { email, password, name, lastname, zip, city, terms, type } = req.body;
    const user = await User.findOne({ email: { $regex: new RegExp(email), $options: 'i' } }).lean();

    if(user) {
        return res.json({ error: { message: "Email is already in use", body: req.body }});
    }
    if(type && !validUserTypes.includes(type)) {
        return res.json({ error: { message: "Invalid user type", body: req.body }});
    }
    if(!email || !password || !name || !lastname || !zip || !city || !terms || !type) {
        return res.json({ 
            error: { message: "Missing values", 
            body: { 
                email: email || 'missing', 
                password: password || 'missing', 
                name: name || 'missing', 
                lastname: lastname || 'missing', 
                zip: zip || 'missing', 
                city: city || 'missing',
                type: type || 'missing',
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
        type,
        profiles: [], 
        active: true, 
        status: "WAITING",
        terms: new Date()
    }).save();
    return res.json(newUser.toObject());
});

/**
 * POST /api/users/{id}/createProfile
 * @summary CREATE a profile on a specific user
 * @tags Users
 * @tags Profiles
 * @param {string} id.path - User id
 * @param {ProfileArgs} request.body.required - Profile info
 * @return {User} 200 - Success Response
 */
router.post('/:id/createProfile', async (req, res) => {
    const { userId, name, birthday, crew, school, image, type } = req.body;
    const profile = await Profile.findOne({ userId, name }).lean();

    if(profile) {
        return res.json({ error: { message: "Name is already in use", body: req.body }});
    }
    if(!userId || !name || !birthday || !image || !type) {
        return res.json({ 
            error: { message: "Missing values", 
            body: {
                userId: userId || 'missing', 
                name: name || 'missing', 
                birthday: birthday || 'missing', 
                image: image || 'missing',
                type: type || 'missing'
            } 
        }});
    }

    const newProfile = await new Profile({ 
        id: v4(),
        userId, 
        name, 
        birthday, 
        crew,
        type,
        school, 
        image,
        active: true
    }).save();
    return res.json(newProfile.toObject());
});

/**
 * POST /api/users/{id}
 * @summary UPDATE a specific user
 * @tags Users
 * @param {string} id.path - User id
 * @param {UserArgs} request.body.required - User info
 * @return {User} 200 - Success Response
 */

router.post('/:id', async (req, res) => {
    const { email, type } = req.body;
    const user = await User.findOne({ id: req.params.id });

    if(!user) {
        return res.json({ error: { message: "User doesn't exists", body: req.body }});
    }

    if(type && !validUserTypes.includes(type)) {
        return res.json({ error: { message: "Invalid user type", body: req.body }});
    }

    const exists = await User.findOne({ email: { $regex: new RegExp(email), $options: 'i' } }).lean();
    if(exists && user.email !== email) {
        return res.json({ error: { message: "Email is already in use", body: req.body }});
    }

    const keys = [ "email", "password", "name", "lastname", "zip", "city", "terms", "type" ];
    for (let idx = 0; idx < keys.length; idx++) {
        const key = keys[idx];
        user[key] = sanitizeValue(req.body[key], user[key]);
    }
    user.deletedAt = null;

    const newUser = await user.save();
    return res.json(newUser);
});

module.exports = router;