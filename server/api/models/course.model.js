const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * A Course
 * @typedef {object} Course
 * @property {string} id - The id for the course
 * @property {string} date - The date for the course start
 * @property {string} name - The course name
 * @property {string} instructor - The instructor profile id
 * @property {string} minLevel - The minimum level to attend
 * @property {string} maxLevel - The maximum level to attend
 */

/**
 * A Course Arguments
 * @typedef {object} CourseArgs
 * @property {string} date.required - The date for the course start
 * @property {string} name.required - The course name
 * @property {string} instructor.required - The instructor profile id
 * @property {string} minLevel - The minimum level to attend
 * @property {string} maxLevel - The maximum level to attend
 */

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