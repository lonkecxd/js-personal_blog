const mongoose = require('mongoose');

let topology_schema = mongoose.Schema({
    ip_address: String,
    text: String,
    src: String,
    status: Number,
    pos: {
        x: Number,
        y: Number
    }
});

let topology = module.exports = mongoose.model('topology', topology_schema);