const mongoose = require('mongoose');
const appSchema = mongoose.Schema({
    pid: {
        type: String,
        ref: "reg",
        required: true
    },
    did: {
        type: String,
        ref: "doctor1",
        required: true
    },
    date: {
        type: String,
        required: true
    },
    slot: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending"
    },
}, {
    timestamps: true
})
const appModel = mongoose.model('app', appSchema);
module.exports = appModel;