const mongoose = require('mongoose');

let line_schema = mongoose.Schema({
    startId: String,
    endId: String
});

let line = module.exports = mongoose.model('line', line_schema);