const mongoose = require('mongoose');
const regSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true,

    },
    altnumber: {
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
    age: {
        type: String,
        required: true
    },
    blood: {
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
    }
}, {
    timestamps: true
})

const regModel = mongoose.model('reg', regSchema);
module.exports = regModel;