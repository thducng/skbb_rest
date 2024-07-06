const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * An Event
 * @typedef {object} Event
 * @property {Date} date.required - The date for the event
 * @property {string} event.required - The event name
 * @property {string} url - The main url for the event
 * @property {string} venue - The venue name
 * @property {string} country - The country of the event
 * @property {string} image - The image of the event
 * @property {string} period - The period of the event (from date to date)
 * @property {string} source - The name of the source (spkz, another website etc.)
 * @property {string} facebook - A facebook url for the event
 * @property {string} instagram - An instagram url for the event
 * @property {string} googlemaps - A google maps url of the location
 * @property {string} zip - The zipcode of the event
 * @property {string} city - The city of the event
 * @property {string} tags - Any tags for the event
 * @property {string} address - The address of the event
 * @property {string} week - The starting week of the event
 */

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
    deletedAt: Date,
    status: String,

    address: String,
    facebook: String,
    instagram: String,
    googlemaps: String,
    zip: String,
    city: String,
    tags: [String],
    week: Number,
}, { timestamps: true });

const Model = mongoose.model('event', schema);
module.exports = Model;