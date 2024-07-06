const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({ 
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    category: String,
    description: String,
    requiredFoundations: [String],
    requiredMinimumPosition: String,
    exp: Number,
    items: [String],
    badge: String
}, { timestamps: true });

const Model = mongoose.model('foundation', schema);
module.exports = Model;