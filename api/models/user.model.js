const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * A User
 * @typedef {object} User
 * @property {string} id - The id of the user
 * @property {string} password - The password of the user
 * @property {string} email - The email of the user
 * @property {string} name - The name of the user
 * @property {string} lastname - The lastname of the user
 * @property {string} profiles - The list of profile id that belongs to the user
 * @property {boolean} active - The status of active user
 * @property {string} status - The status of the user
 * @property {string} terms - The date of which terms was accepted
 * @property {string} type - The type of user
 * @property {string} zip - The zip of user
 * @property {string} city - The city of user
 * @property {string} deletedAt - The date on which this profile is deleted
 */

/**
 * A User Arguments
 * @typedef {object} UserArgs
 * @property {string} password.required - The password of the user
 * @property {string} email.required - The email of the user
 * @property {string} name.required - The name of the user
 * @property {string} lastname.required - The lastname of the user
 * @property {string} terms.required - The date of which terms was accepted
 * @property {string} type.required - The type of user
 * @property {string} zip.required - The zip of user
 * @property {string} city.required - The city of user
 */

const schema = new Schema({ 
    id: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: String, 
    lastname: String,
    profiles: [String], 
    active: Boolean, 
    status: String,
    terms: Date,
    type: String,

    zip: String,
    city: String,

    deletedAt: Date
}, { timestamps: true });

const Model = mongoose.model('user', schema);
module.exports = Model;