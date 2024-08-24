const express = require('express');
const { v4 } = require('uuid');
const { sanitizeValue } = require('../lib/sanitizeValue');
const router = express();
const NblUser = require('./model');

const validUserTypes = [
    'USER',
    'ADMIN'
];

/**
 * GET /nbl/users
 * @summary GET all users
 * @tags Users
 * @tags Nordic Break League
 * @return {array<NblUser>} 200 - Success Response
 */
router.get('/', async (req, res) => {
    const users = await NblUser.find({}).lean();
    return res.json(users);
});

/**
 * Login Arguments
 * @typedef {object} LoginArgs
 * @property {string} email.required - The email of the user
 * @property {string} password.required - The password of the user
 */

/**
 * POST /nbl/users/login
 * @summary LOGIN a specific user
 * @tags Users
 * @tags Nordic Break League
 * @param {LoginArgs} request.body.required - Login info
 * @return {NblUser} 200 - Success Response
 */

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await NblUser.findOne({ email: { $regex: new RegExp(email), $options: 'i' }, password }).lean();

    if(!user) {
        return res.json({ error: { message: "User doesn't exists", body: req.body }});
    }

    return res.json(user);
});

/**
 * POST /nbl/users/signup
 * @summary CREATE a new user
 * @tags Users
 * @tags Nordic Break League
 * @param {NblUserArgs} request.body.required - User info
 * @return {NblUser} 200 - Success Response
 */
router.post('/signup', async (req, res) => {
    const { email, password, name, lastname, type } = req.body;
    const user = await NblUser.findOne({ email: { $regex: new RegExp(email), $options: 'i' } }).lean();

    if(user) {
        return res.json({ error: { message: "Email is already in use", body: req.body }});
    }
    if(type && !validUserTypes.includes(type)) {
        return res.json({ error: { message: "Invalid user type", body: req.body }});
    }
    if(!email || !password || !name || !lastname || !type) {
        return res.json({ 
            error: { message: "Missing values", 
            body: { 
                email: email || 'missing', 
                password: password || 'missing', 
                name: name || 'missing', 
                lastname: lastname || 'missing',
                type: type || 'missing'
            } 
        }});
    }

    const newUser = await new NblUser({ 
        id: v4(), 
        email, 
        password, 
        name, 
        lastname,
        type
    }).save();
    return res.json(newUser.toObject());
});

/**
 * GET /nbl/users/{id}/delete
 * @summary GET a specific user
 * @tags Users
 * @tags Nordic Break League
 * @param {string} id.path - User id
 * @return {NblUser} 200 - Success Response
 */
 router.get('/:id', async (req, res) => {
    const user = await NblUser.findOne({ id: req.params.id }).lean();

    if(!user) {
        return res.json({ error: { message: "User doesn't exists", body: req.body }});
    }

    return res.json({ ...user });
});

/**
 * POST /nbl/users/{id}
 * @summary UPDATE a specific user
 * @tags Users
 * @tags Nordic Break League
 * @param {string} id.path - User id
 * @param {NblUserArgs} request.body.required - User info
 * @return {NblUser} 200 - Success Response
 */

 router.post('/:id', async (req, res) => {
    const { email, type } = req.body;
    const user = await NblUser.findOne({ id: req.params.id });

    if(!user) {
        return res.json({ error: { message: "User doesn't exists", body: req.body }});
    }

    if(type && !validUserTypes.includes(type)) {
        return res.json({ error: { message: "Invalid user type", body: req.body }});
    }

    const exists = await NblUser.findOne({ email: { $regex: new RegExp(email), $options: 'i' } }).lean();
    if(exists && user.email !== email) {
        return res.json({ error: { message: "Email is already in use", body: req.body }});
    }

    const keys = [ "email", "password", "name", "lastname", "type" ];
    for (let idx = 0; idx < keys.length; idx++) {
        const key = keys[idx];
        user[key] = sanitizeValue(req.body[key], user[key]);
    }
    user.deletedAt = null;

    const newUser = await user.save();
    return res.json(newUser);
});

module.exports = router;