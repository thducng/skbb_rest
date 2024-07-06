const express = require('express');
const router = express();

const Feedback = require('../models/feedback.model');

/**
 * GET /api/feedbacks
 * @summary Get all feedback
 * @return {object} 200 - song response
 */
router.get('/', async (req, res) => {
    const results = await Feedback.find({}).lean();
    return res.json(results);
});

/**
 * GET /api/feedbacks/{id}
 * @summary Get a specific feedback
 * @param {string} id.path
 * @return {object} 200 - song response
 */
router.get('/:id', async (req, res) => {
    const result = await Feedback.findOne({ id: req.params.id }).lean();
    if(!result) {
        return res.json({ error: { message: "Feedback doesn't exists", body: req.params }});
    }
    return res.json(result);
});

/**
 * A Feedback
 * @typedef {object} Feedback
 * @property {string} profileId.required - The profileId of the one getting the feedback
 * @property {string} message.required - The feedback message
 * @property {string} from.required - The profileId of the one giving the feedback
 * @property {array<string>} attachments - The file id for the attachments
 */

/**
 * POST /api/feedbacks
 * @param {Feedback} request.body.required - Feedback info
 * @return {object} 200 - song response
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
 * @summary update a specific feedback
 * @param {string} id.path
 * @return {object} 200 - song response
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
 * @summary delete a specific feedback
 * @param {string} id.path
 * @return {object} 200 - song response
 */
router.get('/:id/delete', async (req, res) => {
    await Feedback.deleteOne({ id: req.params.id });
    const newValue = await Feedback.findOne({ id: req.params.id }).lean();
    return res.json(Boolean(newValue));
});

module.exports = router;