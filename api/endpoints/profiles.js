const express = require('express');
const { addExp, addItems } = require('../lib/level');
const { sanitizeValue } = require('../lib/sanitizeValue');
const router = express();

const Profile = require('../models/profile.model');
const File = require('../models/file.model');
const Combo = require('../models/combo.model');
const Foundation = require('../models/foundation.model');
const Mission = require('../models/mission.model');
const Progression = require('../models/progression.model');
const Feedback = require('../models/feedback.model');

const validProfileTypes = [
    'GUEST',
    'BREAKER',
    'INSTRUCTOR',
    'STUDENT',
    'ADMIN'
]

/**
 * GET /api/profiles
 * @summary GET all profiles
 * @tags Profiles
 * @return {array<Profile>} 200 - Success Response
 */
router.get('/', async (req, res) => {
    const profiles = await Profile.find({}).lean();
    return res.json(profiles);
});

/**
 * GET /api/profiles/{id}
 * @summary GET a specific profile
 * @tags Profiles
 * @param {string} id.path - Profile id
 * @return {Profile} 200 - Success Response
 */
router.get('/:id', async (req, res) => {
    const profile = await Profile.findOne({ id: req.params.id }).lean();
    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    return res.json(profile);
});

/**
 * GET /api/profiles/{id}/foundations
 * @summary GET all completed foundations from a specific profile
 * @tags Profiles
 * @tags Foundations
 * @param {string} id.path - Profile id
 * @return {array<Foundation>} 200 - Success Response
 */
 router.get('/:id/foundations', async (req, res) => {
    const profile = await Profile.findOne({ id: req.params.id }).lean();
    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    const progression = await Progression.findOne({ profileId: profile.id }).lean();
    const foundations = await Foundation.find({ id: { $in: progression?.foundations || [] } }).lean();

    return res.json(foundations);
});

/**
 * GET /api/profiles/{id}/missions
 * @summary GET all completed missions from a specific profile
 * @tags Profiles
 * @tags Missions
 * @param {string} id.path - Profile id
 * @return {array<Mission>} 200 - Success Response
 */
 router.get('/:id/missions', async (req, res) => {
    const profile = await Profile.findOne({ id: req.params.id }).lean();
    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    const progression = await Progression.findOne({ profileId: profile.id }).lean();
    const missions = await Mission.find({ id: { $in: progression?.missions || [] } }).lean();

    return res.json(missions);
});

/**
 * GET /api/profiles/{id}/combos
 * @summary GET all completed combos from a specific profile
 * @tags Profiles
 * @tags Combos
 * @param {string} id.path - Profile id
 * @return {array<Combo>} 200 - Success Response
 */
 router.get('/:id/combos', async (req, res) => {
    const profile = await Profile.findOne({ id: req.params.id }).lean();
    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    const progression = await Progression.findOne({ profileId: profile.id }).lean();
    const combos = await Combo.find({ id: { $in: progression?.combos || [] } }).lean();

    return res.json(combos);
});

/**
 * GET /api/profiles/{id}/feedbacks
 * @summary GET all feedbacks from a specific profile
 * @tags Profiles
 * @tags Feedbacks
 * @param {string} id.path - Profile id
 * @return {array<Feedback>} 200 - Success Response
 */
 router.get('/:id/feedbacks', async (req, res) => {
    const profile = await Profile.findOne({ id: req.params.id }).lean();
    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    const feedbacks = await Feedback.find({ profileId: profile.id }).lean();

    return res.json(feedbacks);
});

/**
 * GET /api/profiles/{id}/files
 * @summary GET all files from a specific profile
 * @tags Profiles
 * @param {string} id.path - Profile id
 * @return {array<File>} 200 - Success Response
 */
router.get('/:id/files', async (req, res) => {
    const files = await File.find({ profileId: req.params.id }).lean();
    return res.json(files);
});

/**
 * GET /api/profiles/{id}/videos
 * @summary GET all videos from a specific profile
 * @tags Profiles
 * @param {string} id.path - Profile id
 * @return {array<File>} 200 - Success Response
 */
router.get('/:id/videos', async (req, res) => {
    const videos = await File.find({ profileId: req.params.id, contentType: { $in: ["video/mp4"]} }).lean();
    return res.json(videos);
});

/**
 * POST /api/profiles/{id}/addExp
 * @summary ADD experience points to a profile
 * @tags Profiles
 * @param {string} id.path - Profile id
 * @param {number} request.body.exp.required - Experience points to add
 * @return {Profile} 200 - Success Response
 */
router.post('/:id/addExp', async (req, res) => {
    const { exp } = req.body;
    const profile = await Profile.findOne({ id: req.params.id }).lean();

    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    if(!exp) {
        return res.json({ error: { message: "Missing exp", body: req.params }});
    }


    const newProfile = await addExp(profile, exp);
    return res.json(newProfile);
});

/**
 * POST /api/profiles/{id}/delete
 * @summary DELETE a specific profile
 * @tags Profiles
 * @param {string} id.path - Profile id
 * @return {Profile} 200 - Success Response
 */
router.post('/:id/delete', async (req, res) => {
    // Check on admin user or actual user id
    const profile = await Profile.findOne({ id: req.params.id });

    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    profile.deletedAt = new Date();
    const newProfile = await profile.save();
    return res.json(newProfile.toObject());
});

/**
 * POST /api/profiles/{id}/update
 * @summary UPDATE a specific profile
 * @tags Profiles
 * @param {string} id.path - Profile id
 * @param {ProfileArgs} request.body.required - Profile info
 * @return {Profile} 200 - Success Response
 */
router.post('/:id/update', async (req, res) => {
    const { type } = req.body;
    const profile = await Profile.findOne({ id: req.params.id });

    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    const keys = [ "image", "crew", "school", "type", "name", "birthday"];
    for (let idx = 0; idx < keys.length; idx++) {
        const key = keys[idx];
        profile[key] = sanitizeValue(req.body[key], profile[key]);
    }
    profile.deletedAt = null;

    if(type) {
        if(!validProfileTypes.includes(type)) {
            return res.json({ error: { message: "Invalid profile type", body: req.params }});
        }
        profile.type = type || profile.type;
    }

    const newProfile = await profile.save();
    return res.json(newProfile.toObject());
});

/**
 * POST /api/profiles/{id}/complete
 * @summary COMPLETE a progression for the profile
 * @tags Profiles
 * @param {string} id.path - Profile id
 * @param {string} request.body.type.required - Type of progression ("foundation", "mission", etc.)
 * @param {string} request.body.id.required - The id of the progression ("foundation id", "mission id", etc.)
 * @return {Profile} 200 - Success Response
 */
router.post('/:id/complete', async (req, res) => {
    const { type, id } = req.body;
    const profile = await Profile.findOne({ id: req.params.id });

    if(!profile) {
        return res.json({ error: { message: "Profile doesn't exists", body: req.params }});
    }

    const exists = await Progression.findOne({ profileId: profile.id }).lean();
    if(!exists) {
        await new Progression({
            profileId: profile.id,
            userId: profile.userId,
            foundations: [],
            missions: [],
            combos: []
        }).save();
    }

    switch(type) {
        case "foundation": 
            const foundation = await Foundation.findOne({ id }).lean();
            if(!foundation) {
                return res.json({ error: { message: "Invalid foundation id", body: req.params }});
            }

            await Progression.updateOne({ profileId: profile.id }, { $push: { foundations: id }});
            await addExp(profile, foundation.exp);
            break;
        case "mission":
            const mission = await Mission.findOne({ id }).lean();
            if(!mission) {
                return res.json({ error: { message: "Invalid mission id", body: req.params }});
            }

            await Progression.updateOne({ profileId: profile.id }, { $push: { missions: id }});
            await addExp(profile, mission.exp);
            await addItems(profile, mission.items);
            break;
        case "combo":
            const combo = await Combo.findOne({ id }).lean();
            if(!mission) {
                return res.json({ error: { message: "Invalid combo id", body: req.params }});
            }

            await Progression.updateOne({ profileId: profile.id }, { $push: { combos: id }});
            await addExp(profile, combo.exp);
            break;
        default: 
            return res.json({ error: { message: "Invalid complete type", body: req.params }});
    }

    const newValue = await Profile.findOne({ id }).lean();
    return res.json(newValue);
});

module.exports = router;