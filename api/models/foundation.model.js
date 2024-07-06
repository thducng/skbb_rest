const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * A Foundation
 * @typedef {object} Foundation
 * @property {string} id - The id of the foundation
 * @property {string} name - The name of the foundation
 * @property {string} category - The category this foundation is in
 * @property {string} level - The required level for this foundation
 * @property {number} exp - The experience gained from completing this foundation
 * @property {array<string>} criteria - The list of criterias
 * @property {string} youtubeUrl - The youtube url for the tutorial
 * @property {string} thumbnailUrl - The url for the thumbnail
 */

/**
 * A Foundation Arguments
 * @typedef {object} FoundationArgs
 * @property {string} name.required - The name of the foundation
 * @property {string} category.required - The category this foundation is in
 * @property {string} level - The required level for this foundation
 * @property {number} exp.required - The experience gained from completing this foundation
 * @property {array<string>} criteria - The list of criterias
 * @property {string} youtubeUrl - The youtube url for the tutorial
 * @property {string} thumbnailUrl - The url for the thumbnail
 */

const schema = new Schema({ 
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    category: String,
    level:  String,
    exp: Number,
    criteria: [String],
    youtubeUrl: String,
    thumbnailUrl: String
}, { timestamps: true });

const Model = mongoose.model('foundation', schema);
module.exports = Model;