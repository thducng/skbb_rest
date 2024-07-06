const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * A Profile
 * @typedef {object} Profile
 * @property {string} id - The id of the profile
 * @property {string} userId - The user id that this profile belongs to
 * @property {string} name - The name of the profile user
 * @property {string} type - The type of profile
 * @property {boolean} active - The status of profile active
 * @property {string} birthday - The profile user birthday
 * @property {string} crew - The crew that the profile user belongs to
 * @property {string} school - The school that the profile user belongs to
 * @property {string} image - The file id of the profile image
 * @property {number} prestigeStar - The number of prestige star
 * @property {number} level - The current level 
 * @property {number} exp - The current experience points
 * @property {array<string>} items - The list of items that the profile owns
 * @property {string} deletedAt - The date on which this profile is deleted
 * 
 * @property {array<Foundation>} foundations - The list of completed foundation id
 * @property {array<Mission>} missions - The list of completed mission id
 * @property {array<Feedback>} feedbacks - The list of feedback id
 */

/**
 * A Profile Arguments
 * @typedef {object} ProfileArgs
 * @property {string} userId.required - The user id that this profile belongs to
 * @property {string} name.required - The name of the profile user
 * @property {string} type.required - The type of profile
 * @property {string} birthday.required - The profile user birthday
 * @property {string} crew - The crew that the profile user belongs to
 * @property {string} school - The school that the profile user belongs to
 * @property {string} image.required - The file id of the profile image
 */

const schema = new Schema({ 
    id: {
        type: String,
        required: true,
        unique: true,
    }, 
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: String,
    active: Boolean,
    birthday: String,
    crew: String,
    school: String,
    image: String,

    prestigeStar: Number,
    level: Number,
    exp: Number,
    items: [String],

    deletedAt: Date
}, { timestamps: true });

const Model = mongoose.model('profile', schema);
module.exports = Model;