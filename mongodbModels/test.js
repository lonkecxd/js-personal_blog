const mongoose = require('mongoose');

let test_schema = mongoose.Schema({
    text: String,
    pos: {
        x: Number,
        y: Number
    }
});

let Test = module.exports = mongoose.model('test', test_schema);