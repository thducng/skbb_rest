const express = require('express');
const router = express();

const scrape = require('../scraper');
const Event = require('../models/event.model');
const { v4 } = require('uuid');

const validStatus = [
    'PENDING',
    'APPORVED'
]

router.get('/', async (req, res) => {
    return res.json(await Event.find().lean());
});

router.post('/', async (req, res) => {
    const { date, event, url, venue, country, image, period, source, facebook, instagram, googlemaps, zip, city, tags, address, week } = req.body;
    
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


router.post('/:id/update', async (req, res) => {
    const { date, event, url, venue, country, image, period, source, facebook, instagram, googlemaps, zip, city, tags, status } = req.body;
    
    const existingEvent = await Event.findOne({ id: req.params.id });

    if(!existingEvent) {
        return res.json({ error: { message: "Event doesn't exists", body: req.params }});
    }

    existingEvent.date = date || existingEvent.date;
    existingEvent.event = event || existingEvent.event;
    existingEvent.url = url || existingEvent.url;
    existingEvent.venue = venue || existingEvent.venue;
    existingEvent.country = country || existingEvent.country;
    existingEvent.image = image || existingEvent.image;
    existingEvent.period = period || existingEvent.period;
    existingEvent.source = source || existingEvent.source;
    existingEvent.address = address || existingEvent.address;
    existingEvent.facebook = facebook || existingEvent.facebook;
    existingEvent.instagram = instagram || existingEvent.instagram;
    existingEvent.googlemaps = googlemaps || existingEvent.googlemaps;
    existingEvent.zip = zip || existingEvent.zip;
    existingEvent.city = city || existingEvent.city;
    existingEvent.tags = tags || existingEvent.tags;
    existingEvent.week = week || existingEvent.week;
    existingEvent.deletedAt = null;

    if(status) {
        if(!validStatus.includes(status)) {
            return res.json({ error: { message: "Invalid event status", body: req.params }});
        }
        existingEvent.status = status || existingEvent.status;
    }
    
    existingEvent.checksum = md5(JSON.stringify(existingEvent.toObject()));
    await existingEvent.save();

    return res.json(await Event.findOne({ id: req.params.id }).lean());
});

module.exports = router;