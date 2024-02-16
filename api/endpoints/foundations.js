const express = require('express');
const router = express();

const data = require('../db/foundations.json');

router.get('/', (req, res) => {
    return res.json(data);
});

router.get('/:id', (req, res) => {
    const foundation = data.find((i) => i.id === req.params.id);
    if(!foundation) {
        return res.json({ error: { message: "Foundation doesn't exists", body: req.params }});
    }
    return res.json(foundation);
});

module.exports = router;