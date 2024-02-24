const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    id: String,
    profileId: {
        type: String,
        required: true,
        unique: true
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