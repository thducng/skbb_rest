const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * A File
 * @typedef {object} File
 * @property {string} filename - The filename
 * @property {string} profileId - The profile id of the file owner
 * @property {string} contentType - The file content type ("video/mp4")
 * @property {number} length - The file size
 */

const schema = new Schema({
    id: String,
    profileId: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true,
    },
    length: Number
}, { timestamps: true });

const Model = mongoose.model('file', schema);
module.exports = Model;