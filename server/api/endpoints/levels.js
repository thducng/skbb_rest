const express = require('express');
const router = express();

const Level = require('../models/level.model');

router.get('/', async (req, res) => {
    const levels = await Level.find({}).lean();

    return res.json(levels.map((level) => {
        const moves = level.foundations.reduce((acc, item) => {
            acc += item.moves.length;
            return acc;
        }, 0);

        return { ...level, moves };
    }));
});

router.get('/:id', async (req, res) => {
    const level = await Level.findOne({ id: req.params.id }).lean();
    if(!level) {
        return res.json({ error: { message: "Level doesn't exists", body: req.params }});
    }
    const moves = level.foundations.reduce((acc, item) => {
        acc += item.moves.length;
        return acc;
    }, 0);
    return res.json({ ...level, moves });
});

module.exports = router;