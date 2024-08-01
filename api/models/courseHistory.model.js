const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({ 
    courseId: {
        type: String,
        required: true
    },
    profileId: {
        type: String,
        required: true
    },
    status: String
}, { timestamps: true });

const Model = mongoose.model('courseHistory', schema);
module.exports = Model;