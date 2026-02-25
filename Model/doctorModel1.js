const mongoose = require('mongoose');
const doctorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    qua: {
        type: String,
        required: true
    },
    exp: {
        type: String,
        required: true
    },
    spe: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "u"
    },
    otp: {
        type: String
    },
    otpExpire: {
        type: Date
    },
}, {
    timestamps: true
})

const doctorModel1 = mongoose.model('doctor1', doctorSchema);
module.exports = doctorModel1;