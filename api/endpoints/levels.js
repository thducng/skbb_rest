const express = require('express');
const router = express();

const data = require('../db/levels.json');

router.get('/', (req, res) => {
    return res.json(data.map((level) => {
        const moves = level.foundations.reduce((acc, item) => {
            acc += item.moves.length;
            return acc;
        }, 0);

        return { ...level, moves };
    }));
});

router.get('/:id', (req, res) => {
    const level = data.find((i) => i.id === req.params.id);
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