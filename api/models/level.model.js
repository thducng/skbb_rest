const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subSchema = new Schema({
    foundation: String, 
    moves: [String]
}, { _id: false })

const schema = new Schema({ 
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    level: Number,
    foundations: [subSchema]
}, { timestamps: true });

const Model = mongoose.model('level', schema);
module.exports = Model;