const express = require('express');
const router = express();
const { v4 } = require('uuid');
const NblRegistration = require('./model');
const { sanitizeValue } = require('../lib/sanitizeValue');

const validStatus = ["PENDING", "APPROVED"];

/**
 * GET /nbl/registrations
 * @summary GET all registrations
 * @tags Nordic Break League
 * @return {array<NblRegistration>} 200 - Success Response
 */
router.get('/', async (req, res) => {
    return res.json(await NblRegistration.find().lean());
});

/**
 * GET /nbl/registrations/{id}
 * @summary GET a specific registration
 * @tags Nordic Break League
 * @param {string} id.path - NblRegistration id
 * @return {NblRegistration} 200 - Success Response
 */
router.get('/:id', async (req, res) => {
    return res.json(await NblRegistration.findOne({ id: req.params.id }).lean());
});

/**
 * POST /nbl/registrations
 * @summary CREATE a specific registration
 * @tags Nordic Break League
 * @param {NblRegistrationArgs} request.body.required - NblRegistration info
 * @return {NblRegistration} 200 - Success Response
 */
router.post('/', async (req, res) => {
    const { name, email, country, battles, crew } = req.body;
    
    if(!name || !email || !country) {
        return res.json({ 
            error: { message: "Missing values", 
            body: { 
                name: name || 'missing', 
                email: email || 'missing',
                country: country || 'missing',
                battles: battles || 'missing',
                crew: crew
            } 
        }});
    }

    const registration = {
        id: v4(),
        name,
        email,
        country, 
        crew,
        battles,
        status: 'PENDING'
    }

    await new NblRegistration(registration).save();
    return res.json(await NblRegistration.findOne({ id: registration.id }).lean());
});

/**
 * POST /nbl/registrations/{id}
 * @summary UPDATE a specific registration
 * @tags Nordic Break League
 * @param {string} id.path - NblRegistration id
 * @param {EventArgs} request.body.required - NblRegistration info
 * @return {NblRegistration} 200 - Success Response
 */
 router.post('/:id', async (req, res) => {
    const existing = await NblRegistration.findOne({ id: req.params.id });

    if(!existing) {
        return res.json({ error: { message: "Registration doesn't exists", body: req.params }});
    }

    const keys = ["name", "email", "country", "crew", "status", "battles"];

    for (let idx = 0; idx < keys.length; idx++) {
        const key = keys[idx];
        existing[key] = sanitizeValue(req.body[key], existing[key]);
    }
    existing.deletedAt = null;

    if(req.body.status) {
        if(!validStatus.includes(req.body.status)) {
            return res.json({ error: { message: "Invalid registration status", body: req.params }});
        }
        existing.status = req.body.status || existing.status;
    }
    
    await existing.save();

    return res.json(await NblRegistration.findOne({ id: req.params.id }).lean());
});


/**
 * POST /nbl/registrations/{id}/delete
 * @summary DELETE a specific registration
 * @tags Nordic Break League
 * @param {string} id.path - NblRegistration id
 * @return {NblRegistration} 200 - Success Response
 */
router.post('/:id/delete', async (req, res) => {
    // Check on admin user or actual user id
    const existing = await NblRegistration.findOne({ id: req.params.id });

    if(!existing) {
        return res.json({ error: { message: "Registration doesn't exists", body: req.params }});
    }

    existing.deletedAt = new Date();
    const registration = await existing.save();
    return res.json(registration.toObject());
});

module.exports = router;