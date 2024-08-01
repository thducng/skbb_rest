const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * A Combo
 * @typedef {object} Combo
 * @property {string} id - The id of the combo
 * @property {string} name - The name of the combo
 * @property {string} category - The category this combo is in
 * @property {string} level - The required level for this combo
 * @property {number} exp - The experience gained from completing this combo
 * @property {array<string>} foundations - The list of foundation id that makes this combo
 * @property {string} youtubeUrl - The youtube url for the tutorial
 * @property {string} thumbnailUrl - The url for the thumbnail
 */

/**
 * A Combo Arguments
 * @typedef {object} ComboArgs
 * @property {string} name - The name of the combo
 * @property {string} category - The category this combo is in
 * @property {string} level - The required level for this combo
 * @property {number} exp.required - The experience gained from completing this combo
 * @property {array<string>} foundations.required - The list of foundation id that makes this combo
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
    foundations: [String],
    youtubeUrl: String,
    thumbnailUrl: String
}, { timestamps: true });

const Model = mongoose.model('combo', schema);
module.exports = Model;