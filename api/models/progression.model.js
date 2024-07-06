const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({ 
    profileId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    foundations: [String],
    missions: [String]
}, { timestamps: true });

const Model = mongoose.model('progression', schema);
module.exports = Model;