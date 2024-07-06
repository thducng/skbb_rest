const express = require('express');
const router = express();

const Feedback = require('../models/feedback.model');

/**
 * A Feedback
 * @typedef {object} Feedback
 * @property {string} profileId.required - The profileId of the one getting the feedback
 * @property {string} message.required - The feedback message
 * @property {string} from.required - The profileId of the one giving the feedback
 * @property {array<string>} attachments - The file id for the attachments
 */

/**
 * GET /api/feedbacks
 * @summary Get all feedback
 * @tags feedback
 * @return {Feedback} 200
 */
router.get('/', async (req, res) => {
    const results = await Feedback.find({}).lean();
    return res.json(results);
});

/**
 * GET /api/feedbacks/{id}
 * @summary Get a specific feedback
 * @tags feedback
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
 * @summary Create a specific feedback
 * @tags feedback
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
 * @summary Update a specific feedback
 * @tags feedback
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
 * @summary Delete a specific feedback
 * @tags feedback
 * @param {string} id.path - Feedback id
 * @return {Feedback} 200
 */
router.get('/:id/delete', async (req, res) => {
    await Feedback.deleteOne({ id: req.params.id });
    const newValue = await Feedback.findOne({ id: req.params.id }).lean();
    return res.json(Boolean(newValue));
});

module.exports = router;