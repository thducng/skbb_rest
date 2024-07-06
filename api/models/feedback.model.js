const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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