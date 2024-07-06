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

router.post('/', async (req, res) => {
    const { name, category, level, exp, criteria = [], youtubeUrl, thumbnailUrl } = req.body;
    const foundation = await Foundation.findOne({ name, category }).lean();

    if(foundation) {
        return res.json({ error: { message: "Foundation name and category already exists", body: req.body }});
    }
    if(!name || !category || !exp) {
        return res.json({ 
            error: { message: "Missing values", 
            body: { 
                name: name || 'missing', 
                category: category || 'missing',
                exp: exp || 'missing'
            } 
        }});
    }

    const newFoundation = await new Foundation({ 
        id: v4(), 
        name, 
        category, 
        level, 
        exp, 
        criteria,
        youtubeUrl,
        thumbnailUrl
    }).save();
    return res.json(newFoundation.toObject());
});

router.post('/:id', async (req, res) => {
    const { name, category, level, exp, criteria = [], youtubeUrl, thumbnailUrl } = req.body;
    const foundation = await Foundation.findOne({ name, category }).lean();

    if(!foundation) {
        return res.json({ error: { message: "Foundation doesn't exists", body: req.body }});
    }
    if(!name || !category || !exp) {
        return res.json({ 
            error: { message: "Missing values", 
            body: { 
                name: name || 'missing', 
                category: category || 'missing',
                exp: exp || 'missing'
            } 
        }});
    }

    await Foundation.updateOne({ id: result.id }, {
        name, 
        category, 
        level, 
        exp, 
        criteria,
        youtubeUrl,
        thumbnailUrl
    });

    const newFoundation = await Foundation.findOne({ id: result.id }).lean();
    return res.json(newFoundation);
});

router.get('/:id/delete', async (req, res) => {
    await Foundation.deleteOne({ id: req.params.id });
    const newValue = await Foundation.findOne({ id: req.params.id }).lean();
    return res.json(Boolean(newValue));
});

module.exports = router;