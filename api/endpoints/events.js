const express = require('express');
const router = express();
const md5 = require('md5');

const scrape = require('../scraper');
const Event = require('../models/event.model');
const { v4 } = require('uuid');
const { sanitizeValue } = require('../lib/sanitizeValue');

const validStatus = [
    'PENDING',
    'APPROVED',
    'REJECTED',
]

/**
 * GET /api/events
 * @summary GET all events
 * @tags Events
 * @return {array<Event>} 200
 */
router.get('/', async (req, res) => {
    return res.json(await Event.find().lean());
});

/**
 * GET /api/events/{id}
 * @summary GET a specific event
 * @tags Events
 * @param {string} id.path - Event id
 * @return {Event} 200
 */
router.get('/:id', async (req, res) => {
    return res.json(await Event.findOne({ id: req.params.id }).lean());
});

/**
 * POST /api/events
 * @summary CREATE a specific event
 * @tags Events
 * @param {Event} request.body.required - Event info
 * @return {Event} 200
 */
router.post('/', async (req, res) => {
    const { date, event, url, venue, country, image, period, source, facebook, instagram, googlemaps, zip, city, tags, address, week } = req.body;
    
    if(!date || !event) {
        return res.json({ 
            error: { message: "Missing values", 
            body: { 
                date: date || 'missing', 
                event: event || 'missing'
            } 
        }});
    }

    const newEvent = {
        id: v4(),
        date, 
        event, 
        url, 
        venue, 
        country, 
        image, 
        period, 
        source,
        address,
        facebook,
        instagram,
        googlemaps,
        zip,
        city,
        tags,
        status: 'PENDING',
        week
    }
    event.checksum = md5(JSON.stringify(newEvent));

    await new Event(newEvent).save();

    return res.json(await Event.findOne({ id: newEvent.id }).lean());
});

router.get('/scrape', async (req, res) => {
    return res.json(await scrape());
});

router.get('/scrape/:source', async (req, res) => {
    return res.json(await scrape(req.params.source));
});

/**
 * POST /api/events/{id}/delete
 * @summary DELETE a specific event
 * @tags Events
 * @param {string} id.path - Event id
 * @return {Event} 200
 */
router.post('/:id/delete', async (req, res) => {
    // Check on admin user or actual user id
    const existingEvent = await Event.findOne({ id: req.params.id });

    if(!existingEvent) {
        return res.json({ error: { message: "Event doesn't exists", body: req.params }});
    }

    existingEvent.deletedAt = new Date();
    const newEvent = await existingEvent.save();
    return res.json(newEvent.toObject());
});

/**
 * POST /api/events/{id}/update
 * @summary UPDATE a specific event
 * @tags Events
 * @param {string} id.path - Event id
 * @param {Event} request.body.required - Event info
 * @return {Event} 200
 */
router.post('/:id/update', async (req, res) => {
    const existingEvent = await Event.findOne({ id: req.params.id });

    if(!existingEvent) {
        return res.json({ error: { message: "Event doesn't exists", body: req.params }});
    }

    const keys = ["date", "event", "url", "venue", "country", "image", "period", "source", "facebook", "instagram", "googlemaps", "zip", "city", "tags", "address", "week"];

    for (let idx = 0; idx < keys.length; idx++) {
        const key = keys[idx];
        existingEvent[key] = sanitizeValue(req.body[key], existingEvent[key]);
    }
    existingEvent.deletedAt = null;

    if(req.body.status) {
        if(!validStatus.includes(req.body.status)) {
            return res.json({ error: { message: "Invalid event status", body: req.params }});
        }
        existingEvent.status = req.body.status || existingEvent.status;
    }
    
    existingEvent.checksum = md5(JSON.stringify(existingEvent.toObject()));
    await existingEvent.save();

    return res.json(await Event.findOne({ id: req.params.id }).lean());
});

module.exports = router;