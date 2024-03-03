const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    age: Number,
    crew: String,
    school: String,
    image: String,

    prestigeStar: Number,
    level: Number,
    exp: Number
}, { timestamps: true });

const Model = mongoose.model('Profile', schema);
module.exports = Model;