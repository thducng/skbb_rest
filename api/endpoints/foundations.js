const express = require('express');
const router = express();

const Foundation = require('../models/foundation.model');

/**
 * GET /api/foundations
 * @summary GET all foundations
 * @tags Foundations
 * @return {array<Foundation>} 200 - Success Response
 */

router.get('/', async (req, res) => {
    const foundations = await Foundation.find({}).lean();
    return res.json(foundations);
});

/**
 * GET /api/foundations/{id}
 * @summary GET a specific foundation
 * @tags Foundations
 * @param {string} id.path - Foundation id
 * @return {Foundation} 200 - Success Response
 */
router.get('/:id', async (req, res) => {
    const foundation = await Foundation.findOne({ id: req.params.id }).lean();
    if(!foundation) {
        return res.json({ error: { message: "Foundation doesn't exists", body: req.params }});
    }
    return res.json(foundation);
});

/**
 * POST /api/foundations
 * @summary CREATE a specific foundation
 * @tags Foundations
 * @param {FoundationArgs} request.body.required - Foundation info
 * @return {Foundation} 200 - Success Response
 */
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

/**
 * POST /api/foundations/{id}
 * @summary UPDATE a specific foundation
 * @tags Foundations
 * @param {string} id.path - Foundation id
 * @param {FoundationArgs} request.body.required - Foundation info
 * @return {Foundation} 200 - Success Response
 */
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

/**
 * GET /api/foundations/{id}/delete
 * @summary DELETE a specific foundation
 * @tags Foundations
 * @param {string} id.path - Foundation id
 * @return {boolean} 200 - Success Response
 */
router.get('/:id/delete', async (req, res) => {
    await Foundation.deleteOne({ id: req.params.id });
    const newValue = await Foundation.findOne({ id: req.params.id }).lean();
    return res.json(Boolean(newValue));
});

module.exports = router;