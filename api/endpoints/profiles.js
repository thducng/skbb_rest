const express = require('express');
const router = express();

const data = require('../db/profiles.json');

router.get('/', (req, res) => {
    return res.json(data);
});

router.get('/:id', (req, res) => {
    const profile = data.find((i) => i.id === req.params.id);
    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }
    return res.json(profile);
});

module.exports = router;