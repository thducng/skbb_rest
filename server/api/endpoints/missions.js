const express = require('express');
const router = express();
const { v4 } = require('uuid');

const Mission = require('../models/mission.model');
const Foundation = require('../models/foundation.model');

/**
 * GET /api/missions
 * @summary GET all missions
 * @tags Missions
 * @return {array<Mission>} 200 - Success Response
 */
router.get('/', async (req, res) => {
    const results = await Mission.find({}).lean();
    return res.json(results);
});

/**
 * GET /api/missions/{id}
 * @summary GET a specific mission
 * @tags Missions
 * @param {string} id.path - Mission id
 * @return {Mission} 200 - Success Response
 */

router.get('/:id', async (req, res) => {
    const result = await Mission.findOne({ id: req.params.id }).lean();
    if(!result) {
        return res.json({ error: { message: "Mission doesn't exists", body: req.params }});
    }
    return res.json(result);
});

/**
 * GET /api/missions/{id}/foundations
 * @summary GET all required foundations from a specific mission
 * @tags Missions
 * @tags Foundations
 * @param {string} id.path - Mission id
 * @return {array<Foundation>} 200 - Success Response
 */

 router.get('/:id/foundations', async (req, res) => {
    const result = await Mission.findOne({ id: req.params.id }).lean();
    if(!result) {
        return res.json({ error: { message: "Mission doesn't exists", body: req.params }});
    }

    const foundations = await Foundation.find({ id: { $in: result.requiredFoundations }}).lean();
    return res.json(foundations);
});

/**
 * POST /api/missions
 * @summary CREATE a specific mission
 * @tags Missions
 * @param {MissionArgs} request.body.required - Mission info
 * @return {Mission} 200 - Success Response
 */
router.post('/', async (req, res) => {
    const { name, category, description, requiredFoundations = [], requiredMinimumPosition, exp, items = [], badge } = req.body;
    const result = await Mission.findOne({ name, category }).lean();

    if(result) {
        return res.json({ error: { message: "Mission name and category already exists", body: req.body }});
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

    const newMission = await new Mission({ 
        id: v4(), 
        name, 
        category, 
        description, 
        exp,
        requiredFoundations,
        requiredMinimumPosition,
        items,
        badge
    }).save();
    return res.json(newMission.toObject());
});

/**
 * POST /api/missions/{id}
 * @summary UPDATE a specific mission
 * @tags Missions
 * @param {string} id.path - Mission id
 * @param {MissionArgs} request.body.required - Mission info
 * @return {Mission} 200 - Success Response
 */
router.post('/:id', async (req, res) => {
    const { name, category, description, requiredFoundations = [], requiredMinimumPosition, exp, items = [], badge } = req.body;
    const result = await Mission.findOne({ id: req.params.id }).lean();

    if(!result) {
        return res.json({ error: { message: "Mission doesn't exists", body: req.body }});
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

    await Mission.updateOne({ id: result.id }, {
        name, 
        category, 
        description, 
        exp,
        requiredFoundations,
        requiredMinimumPosition,
        items,
        badge
    });

    const newMission = await Mission.findOne({ id: result.id }).lean();
    return res.json(newMission);
});

/**
 * GET /api/missions/{id}/delete
 * @summary DELETE a specific mission
 * @tags Missions
 * @param {string} id.path - Mission id
 * @return {boolean} 200 - Success Response
 */
router.get('/:id/delete', async (req, res) => {
    await Mission.deleteOne({ id: req.params.id });
    const newValue = await Mission.findOne({ id: req.params.id }).lean();
    return res.json(Boolean(newValue));
});

module.exports = router;