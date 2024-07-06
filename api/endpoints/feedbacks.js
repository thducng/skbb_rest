const express = require('express');
const router = express();

const Feedback = require('../models/feedback.model');

router.get('/', async (req, res) => {
    const results = await Feedback.find({}).lean();
    return res.json(results);
});

router.get('/:id', async (req, res) => {
    const result = await Feedback.findOne({ id: req.params.id }).lean();
    if(!result) {
        return res.json({ error: { message: "Feedback doesn't exists", body: req.params }});
    }
    return res.json(result);
});

router.post('/', async (req, res) => {
    const { profileId, message, from, attachments = [] } = req.body;
    if(!profileId || !message || !from) {
        return res.json({ 
            error: { message: "Missing values", 
            body: { 
                profileId: profileId || 'missing', 
                message: message || 'missing',
                from: from || 'missing'
            } 
        }});
    }

    const newValue = await new Feedback({ 
        id: v4(),
        profileId,
        message,
        from,
        attachments
    }).save();
    return res.json(newValue.toObject());
});

router.post('/:id', async (req, res) => {
    const { profileId, message, from, attachments = [] } = req.body;
    if(!profileId || !message || !from) {
        return res.json({ 
            error: { message: "Missing values", 
            body: { 
                profileId: profileId || 'missing', 
                message: message || 'missing',
                from: from || 'missing'
            } 
        }});
    }

    await Feedback.updateOne({ id: req.params.id }, {
        message,
        from,
        attachments
    });

    const newValue = await Feedback.findOne({ id: result.id }).lean();
    return res.json(newValue);
});

router.get('/:id/delete', async (req, res) => {
    await Feedback.deleteOne({ id: req.params.id });
    const newValue = await Feedback.findOne({ id: req.params.id }).lean();
    return res.json(Boolean(newValue));
});

module.exports = router;