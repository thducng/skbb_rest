const express = require('express');
const router = express();

const scrape = require('../scraper');
const Event = require('../models/event.model');

router.get('/', async (req, res) => {
    return res.json(await Event.find().lean());
});

router.get('/scrape', async (req, res) => {
    return res.json(await scrape());
});

router.get('/scrape/:source', async (req, res) => {
    return res.json(await scrape(req.params.source));
});

module.exports = router;