const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please add a name'],
        unique: true,
        trim: true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        required: [true,'Please add an address']
    },
    district:{
        type: String,
        required: [true,'Please add a district']
    },
    province:{
        type: String,
        required: [true,'Please add a province']
    },
    postalcode:{
        type: String,
        required: [true,'Please add a postalcode'],
        maxlength:[5,'Postal Code can not be more than 5 digits']
    },
    region:{
        type: String,
        required: [true,'Please add a region']
    },  
    website:{
        type: String
    },
    description:{
        type: String
    },
    tel:{
        type: String
    },
},{
    toJSON: {virtuals:true,getters: true},
    toObject: {virtuals:true,getters: true}
});

//Reverse populate with virtuals
CompanySchema.virtual('bookings',{
    ref: 'Booking',
    localField: '_id',
    foreignField: 'company',
    justOne: false
});
module.exports=mongoose.model('Company',CompanySchema);