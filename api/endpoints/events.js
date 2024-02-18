const express = require('express');
const router = express();

const fetchEvents = require('../scraper/breakevents');
const Event = require('../models/event.model');
let data = [];

router.get('/', async (req, res) => {
    return res.json(await Event.find().lean());
});

router.get('/scrape', async (req, res) => {
    data = await fetchEvents();
    return res.json(data);
});

module.exports = router;