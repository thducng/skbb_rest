const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * A Feedback
 * @typedef {object} Feedback
 * @property {string} profileId.required - The profileId of the one getting the feedback
 * @property {string} message.required - The feedback message
 * @property {string} from.required - The profileId of the one giving the feedback
 * @property {array<string>} attachments - The file id for the attachments
 */

const schema = new Schema({ 
    profileId: {
        type: String,
        required: true,
    },
    message: String,
    from: String,
    attachments: [String]
}, { timestamps: true });

const Model = mongoose.model('feedback', schema);
module.exports = Model;