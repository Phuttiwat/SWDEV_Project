const mongoose = require('mongoose');

const FeedBackSchema = new mongoose.Schema({
    message:{
        type: String,
        require: true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        require: true
    },
    booking:{
        type:mongoose.Schema.ObjectId,
        ref: 'Booking',
        require: true
    },
    company:{
        type:mongoose.Schema.ObjectId,
        ref: 'Company',
        require: true
    },
    createAt:{
        type:Date,
        default: Date.now
    }
})

module.exports=mongoose.model('Feedback',FeedBackSchema)