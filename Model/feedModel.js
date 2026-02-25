const mongoose = require('mongoose');
const feedSchema = mongoose.Schema({
    uid: {
        type: String,
        refPath: "utype"
    },
    utype: {
        type: String,
        require: true
    },
    type: String,
    msg: String,
    status: String
});
const feedModel = mongoose.model('feedback', feedSchema);
module.exports = feedModel;