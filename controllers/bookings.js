const Booking = require("../models/Booking")
const Company = require("../models/Company")

//@desc     Get all bookings
//@route    GET /api/v1/bookings
//@access   Public
exports.getBookings = async (req,res,next)=>{
    let query;
    //General user can see only their appoinments
    if(req.user.role !== 'admin'){
        query=Booking.find({user:req.user.id}).populate({
            path: 'company',
            select: 'name description website tel'
        });
    }else{
        if(req.params.companyId){
            query=Booking.find({company: req.params.companyId}).populate({
                path: 'company',
                select: 'name description website tel'
            });
        }else{
            query=Booking.find().populate({
                path: 'company',
                select: 'name description website tel'
            });
        }
       
    }
    try{
        const bookings= await query;

        res.status(200).json({
            success:true,
            count: bookings.length,
            data: bookings.map(booking => ({
                id: booking._id,
                bookDate: booking.bookDate,
                company: {
                    id: booking.company._id,
                    name: booking.company.name,
                    description: booking.company.description,
                    website: booking.company.website,
                    tel: booking.company.tel
                }
            }))
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false, message:"Cannot find Booking"});
    }
};

//@desc     Get all bookings from a specific date
//@route    GET /api/v1/bookings/date/:date
//@access   Public
exports.getBookingsByDate = async (req,res,next)=>{
    try {
        const dateParam = req.params.date;

        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateParam)) {
            return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        const date = new Date(dateParam);

        if (isNaN(date.getTime()) || !date) {
            return res.status(400).json({ success: false, message: 'Invalid date' });
        }

        // Set the start and end of the day for the query
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const bookings = await Booking.find({
            bookDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).populate({
            path: 'company',
            select: 'name description website tel'
        });

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Cannot find Booking' });
    }
}

//@desc     Get single booking
//@route    Get /api/v1/bookings/:id
//@access   Public
exports.getBooking = async (req,res,next)=>{
    try{
        const booking = await Booking.findById(req.params.id).populate({
            path: 'company',
            select: 'name description tel'
        });

        if(!booking){
            return res.status(404).json({success:false,message:`No booking with the id of ${req.params.id}`});
        }

        res.status(200).json({
            success:true,
            data: booking
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Booking"});
    }
}

//@desc     Add booking
//@route    POST /api/v1/companies/:companyID/bookings/
//@access   Private
exports.addBooking = async (req,res,next)=>{
    
    try{
        req.body.company = req.params.companyId;
        const company = await Company.findById(req.params.companyId);

        if(!company){
            return res.status(404).json({success:false,message:`No company with the id of ${req.params.companyId}`});
        }

        //add user Id to req.body
        req.body.user=req.user.id;

        // Check booking date is valid (May 10 - 13, 2022)
        const bookDate = new Date(req.body.bookDate);
        const startDate = new Date('2022-05-10');
        const endDate = new Date('2022-05-13T23:59:59.999Z');

        if (bookDate < startDate || bookDate > endDate) {
            return res.status(400).json({
                success: false,
                message: 'Booking date must be between May 10 - 13, 2022'
            });
        }

        //Check for existed booking
        const existedBooking=await Booking.find({user:req.user.id});

        //Check if user has already booked this company
        const alreadyBookedThisCompany = existedBooking.some(
            booking => booking.company.toString() === req.params.companyId
        );

        if (alreadyBookedThisCompany) {
            return res.status(400).json({
                success: false,
                message: `You have already booked an interview with this company.`
            });
        }

        //if the user is not an admin, they can only create 3 booking.
        if(existedBooking.length >=3 && req.user.role !== 'admin'){
            return res.status(400).json({succes:false,message:`The user with ID ${req.user.id} has already made 3 interviews`});
        }

        const booking = await Booking.create(req.body);

        res.status(200).json({
            success: true,
            data: booking
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot create Booking"});
    }
};

//@desc     Update booking
//@route    PUT /api/v1/bookings/:id
//@access   Private
exports.updateBooking=async (req,res,next)=>{
    try{
        let booking= await Booking.findById(req.params.id);

        if(!booking){
            return res.stataus.json({success:false,message:`No booking with the id of ${req.params.id}`});
        }

        //Make sure user is the appointment owner
        if(booking.user.toString()!== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this booking`});
        }

        booking=await Booking.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });

        res.status(200).json({
            success:true,
            data: booking
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot update Booking"});
    }
};

//@desc     Delete booking
//@route    Delete /api/v1/bookings/:id
//@access   Private
exports.deleteBooking=async (req,res,next)=>{
    try{
        const booking= await Booking.findById(req.params.id);
        if(!booking){
            return res.status(404).json({success:false,message:`No booking with the id of ${req.params.id}`});
        }

        //Make sure user is the appointment owner
        if(booking.user.toString()!== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this booking`});
        }
        await booking.deleteOne();

        res.status(200).json({
            success:true,
            data:{}
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot delete booking"});
    }
};