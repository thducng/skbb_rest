const express = require('express');
const router = express();

const fetchEvents = require('../scraper/breakevents');
let data = [];

router.get('/', (req, res) => {
    return res.json(data);
});

router.get('/scrape', async (req, res) => {
    data = await fetchEvents();
    return res.json(data);
});

module.exports = router;