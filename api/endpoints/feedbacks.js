const express = require('express');
const router = express();

const Feedback = require('../models/feedback.model');

/**
 * GET /api/feedbacks
 * @summary GET all feedback
 * @tags Feedbacks
 * @return {Feedback} 200
 */
router.get('/', async (req, res) => {
    const results = await Feedback.find({}).lean();
    return res.json(results);
});

/**
 * GET /api/feedbacks/{id}
 * @summary GET a specific feedback
 * @tags Feedbacks
 * @param {string} id.path - Feedback id
 * @return {Feedback} 200
 */
router.get('/:id', async (req, res) => {
    const result = await Feedback.findOne({ id: req.params.id }).lean();
    if(!result) {
        return res.json({ error: { message: "Feedback doesn't exists", body: req.params }});
    }
    return res.json(result);
});


/**
 * POST /api/feedbacks
 * @summary CREATE a specific feedback
 * @tags Feedbacks
 * @param {Feedback} request.body.required - Feedback info
 * @return {Feedback} 200
 */
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

/**
 * POST /api/feedbacks/{id}
 * @summary UPDATE a specific feedback
 * @tags Feedbacks
 * @param {string} id.path - Feedback id
 * @param {Feedback} request.body.required - Feedback info
 * @return {Feedback} 200
 */
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

/**
 * POST /api/feedbacks/{id}/delete
 * @summary DELETE a specific feedback
 * @tags Feedbacks
 * @param {string} id.path - Feedback id
 * @return {Feedback} 200
 */
router.get('/:id/delete', async (req, res) => {
    await Feedback.deleteOne({ id: req.params.id });
    const newValue = await Feedback.findOne({ id: req.params.id }).lean();
    return res.json(Boolean(newValue));
});

module.exports = router;