const express = require('express');
const router = express();

const data = require('../db/profiles.json');

router.get('/', (req, res) => {
    return res.json(data);
});

router.get('/:id', (req, res) => {
    return res.json(data.find((i) => i.id === req.params.id));
});

module.exports = router;