const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * A Create File Argument
 * @typedef {object} CreateFileArgs
 * @property {string} profileId.required - The profile id of the file owner
 * @property {string} name - A custom name
 * @property {string} description - File description
 * @property {array<string>} tags - Any tags for the file
 */

/**
 * A File Argument
 * @typedef {object} FileArgs
 * @property {string} name - A custom name
 * @property {string} description - File description
 * @property {array<string>} tags - Any tags for the file
 */


/**
 * A File
 * @typedef {object} File
 * @property {string} filename - The filename
 * @property {string} profileId - The profile id of the file owner
 * @property {string} contentType - The file content type ("video/mp4")
 * @property {number} length - The file size
 * @property {string} name - A custom name
 * @property {string} description - File description
 * @property {array<string>} tags - Any tags for the file
 */

const schema = new Schema({
    id: String,
    profileId: {
        type: String
    },
    filename: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true,
    },
    length: Number,

    // meta data
    name: String,
    description: String,
    tags: [String]
}, { timestamps: true });

const Model = mongoose.model('file', schema);
module.exports = Model;