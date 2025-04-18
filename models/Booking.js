const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    bookDate: {
        type: Date,
        require: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        require: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking',BookingSchema);