const express = require('express');
const router = express();

const Combo = require('../models/combo.model');

/**
 * GET /api/combos
 * @summary GET all combos
 * @tags Combos
 * @return {array<Combo>} 200 - Success Response
 */

router.get('/', async (req, res) => {
    const results = await Combo.find({}).lean();
    return res.json(results);
});

/**
 * GET /api/combos/{id}
 * @summary GET a specific combo
 * @tags Combos
 * @param {string} id.path - Combo id
 * @return {Combo} 200 - Success Response
 */
router.get('/:id', async (req, res) => {
    const result = await Combo.findOne({ id: req.params.id }).lean();
    if(!result) {
        return res.json({ error: { message: "Combo doesn't exists", body: req.params }});
    }
    return res.json(result);
});

/**
 * POST /api/combos
 * @summary CREATE a specific combo
 * @tags Combos
 * @param {ComboArgs} request.body.required - Combo info
 * @return {Combo} 200 - Success Response
 */
router.post('/', async (req, res) => {
    const { name, category, level, exp, foundations = [], youtubeUrl, thumbnailUrl } = req.body;
    const result = await Combo.findOne({ name, category, youtubeUrl, exp }).lean();

    if(result) {
        return res.json({ error: { message: "Combo already exists", body: req.body }});
    }
    if(!name || !category || !exp || !foundations.length || !youtubeUrl) {
        return res.json({ 
            error: { message: "Missing values", 
            body: { 
                name: name || 'missing', 
                category: category || 'missing',
                foundations: foundations || 'missing',
                exp: exp || 'missing',
                youtubeUrl: youtubeUrl || 'missing'
            } 
        }});
    }

    const newValue = await new Combo({ 
        id: v4(), 
        name, 
        category, 
        level, 
        exp, 
        foundations,
        youtubeUrl,
        thumbnailUrl
    }).save();
    return res.json(newValue.toObject());
});

/**
 * POST /api/combos/{id}
 * @summary UPDATE a specific combo
 * @tags Combos
 * @param {string} id.path - Combo id
 * @param {ComboArgs} request.body.required - Combo info
 * @return {Combo} 200 - Success Response
 */
router.post('/:id', async (req, res) => {
    const { name, category, level, exp, foundations = [], youtubeUrl, thumbnailUrl } = req.body;
    const result = await Combo.findOne({ name, category }).lean();

    if(!result) {
        return res.json({ error: { message: "Combo doesn't exists", body: req.body }});
    }
    if(!name || !category || !exp || !foundations.length || !youtubeUrl) {
        return res.json({ 
            error: { message: "Missing values", 
            body: { 
                name: name || 'missing', 
                category: category || 'missing',
                foundations: foundations || 'missing',
                exp: exp || 'missing',
                youtubeUrl: youtubeUrl || 'missing'
            } 
        }});
    }

    await Combo.updateOne({ id: result.id }, {
        name, 
        category, 
        level, 
        exp, 
        foundations,
        youtubeUrl,
        thumbnailUrl
    });

    const newValue = await Combo.findOne({ id: result.id }).lean();
    return res.json(newValue);
});

/**
 * GET /api/combos/{id}/delete
 * @summary DELETE a specific combo
 * @tags Combos
 * @param {string} id.path - Combos id
 * @return {boolean} 200 - Success Response
 */
router.get('/:id/delete', async (req, res) => {
    await Combo.deleteOne({ id: req.params.id });
    const newValue = await Combo.findOne({ id: req.params.id }).lean();
    return res.json(Boolean(newValue));
});

module.exports = router;