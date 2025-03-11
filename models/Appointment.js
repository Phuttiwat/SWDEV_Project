const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    apptDate: {
        type: Date,
        require: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    hospital: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hospital',
        require: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment',AppointmentSchema);