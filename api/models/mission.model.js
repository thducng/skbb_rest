const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * A Mission
 * @typedef {object} Mission
 * @property {string} id - The id of the mission
 * @property {string} name - The name of the mission
 * @property {string} category - The category this mission is in
 * @property {string} description - The description of the mission
 * @property {array<string>} requiredFoundations - The list of foundation id, that is required to complete
 * @property {number} requiredMinimumPosition - The required minimum position in an event to complete
 * @property {number} exp - The experience gained upon completion
 * @property {array<string>} items - The list of items that is rewarded upon completion
 * @property {string} badge - The badge that is rewarded upon completion
 */

/**
 * A Mission Arguments
 * @typedef {object} MissionArgs
 * @property {string} name.required - The name of the mission
 * @property {string} category.required - The category this mission is in
 * @property {string} description - The description of the mission
 * @property {array<string>} requiredFoundations - The list of foundation id, that is required to complete
 * @property {number} requiredMinimumPosition - The required minimum position in an event to complete
 * @property {number} exp.required - The experience gained upon completion
 * @property {array<string>} items - The list of items that is rewarded upon completion
 * @property {string} badge - The badge that is rewarded upon completion
 */

const schema = new Schema({ 
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    category: String,
    description: String,
    requiredFoundations: [String],
    requiredMinimumPosition: Number,
    exp: Number,
    items: [String],
    badge: String
}, { timestamps: true });

const Model = mongoose.model('mission', schema);
module.exports = Model;