const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    checksum: String,
    date: String,
    event: String,
    url: String,
    venue: String,
    country: String,
    image: String,
    period: String,
    source: String,
    deletedAt: Date
}, { timestamps: true });

const Model = mongoose.model('event', schema);
module.exports = Model;