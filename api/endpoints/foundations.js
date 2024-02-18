const express = require('express');
const router = express();

const Foundation = require('../models/foundation.model');

router.get('/', async (req, res) => {
    const foundations = await Foundation.find({}).lean();
    return res.json(foundations);
});

router.get('/:id', async (req, res) => {
    const foundation = await Foundation.findOne({ id: req.params.id }).lean();
    if(!foundation) {
        return res.json({ error: { message: "Foundation doesn't exists", body: req.params }});
    }
    return res.json(foundation);
});

module.exports = router;