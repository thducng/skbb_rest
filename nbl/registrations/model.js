const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * A Nbl Registration
 * @typedef {object} NblRegistration
 * @property {string} id - The id of the register
 * @property {string} email - The email of the register
 * @property {string} name - The name of the register
 * @property {string} country - The country of the register
 * @property {string} crew - The crew of register
 * @property {Array<string>} battles - The battles that is registered to
 * @property {string} deletedAt - The date on which this register is deleted
 */

/**
 * A Nbl Registration Arguments
 * @typedef {object} NblRegistrationArgs
 * @property {string} email.required - The email of the register
 * @property {string} name.required - The name of the register
 * @property {string} country.required - The country of the register
 * @property {Array<string>} battles.required - The battles that is registered to
 * @property {string} crew - The crew of register
 */

const schema = new Schema({ 
    id: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: String, 
    country: String,
    crew: String,
    battles: [String],
    status: String,
    deletedAt: Date
}, { timestamps: true });

const Model = mongoose.model('nbl-registrations', schema);
module.exports = Model;