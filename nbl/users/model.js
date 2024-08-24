const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * A Nbl User
 * @typedef {object} NblUser
 * @property {string} id - The id of the user
 * @property {string} password - The password of the user
 * @property {string} email - The email of the user
 * @property {string} name - The name of the user
 * @property {string} lastname - The lastname of the user
 * @property {string} type - The type of user
 * @property {string} deletedAt - The date on which this profile is deleted
 */

/**
 * A Nbl User Arguments
 * @typedef {object} NblUserArgs
 * @property {string} password.required - The password of the user
 * @property {string} email.required - The email of the user
 * @property {string} name.required - The name of the user
 * @property {string} lastname.required - The lastname of the user
 * @property {string} type.required - The type of user
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
    type: String,
    deletedAt: Date
}, { timestamps: true });

const Model = mongoose.model('nbl-user', schema);
module.exports = Model;