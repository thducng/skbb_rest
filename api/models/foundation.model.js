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
    level: String,
    exp: Number,
    criteria: [String],
    youtubeUrl: String,
    thumbnailUrl: String
}, { timestamps: true });

const Model = mongoose.model('foundation', schema);
module.exports = Model;