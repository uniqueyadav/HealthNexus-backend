const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'app', // Appointment model reference
        required: true
    },
    pid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reg', // Patient model reference
        required: true
    },
    did: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor', // Doctor model reference
        required: true
    },
    medicines: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true }, // e.g., 1-0-1
        duration: { type: String, required: true } // e.g., 5 days
    }],
    advice: {
        type: String,
        default: ""
    },
    date: {
        type: String,
        default: () => new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'Asia/Kolkata'
        }).format(new Date())
    }
}, { timestamps: true });

// Exporting with the name you used in routes
module.exports = mongoose.model('prescriptionModel', PrescriptionSchema);