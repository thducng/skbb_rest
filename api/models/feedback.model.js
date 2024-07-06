const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * A Feedback
 * @typedef {object} Feedback
 * @property {string} id - The id of the feedback
 * @property {string} profileId - The profileId of the one getting the feedback
 * @property {string} message - The feedback message
 * @property {string} from - The profileId of the one giving the feedback
 * @property {array<string>} attachments - The file id for the attachments
 */

/**
 * A Feedback Arguments
 * @typedef {object} FeedbackArgs
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