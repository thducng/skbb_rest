const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({ 
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    instructor: String,
    date: Date, 
    minLevel: Number, 
    maxLevel: Number
}, { timestamps: true });

const Model = mongoose.model('course', schema);
module.exports = Model;