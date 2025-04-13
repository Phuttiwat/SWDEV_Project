const Feedback = require('../models/Feedback');
const Booking = require('../models/Booking');
const Company = require('../models/Company');

//@desc     Get all bookings
//@route    GET /api/v1/feedbacks
//@access   Public
exports.getFeedbacks = async (req,res,next)=>{
    let query;
    //General user can see onlu their appoinments
    if(req.user.role !== 'admin'){
        query=Feedback.find({user:req.user.id}).populate({
            path: 'company',
            select: 'name description tel'
        });
    }else{
        if(req.params.companyId){
            query=Feedback.find({company: req.params.companyId}).populate({
                path: 'company',
                select: 'name description tel'
            });
        }else{
            query=Booking.find().populate({
                path: 'company',
                select: 'name description tel'
            });
        }
       
    }
    try{
        const feedbacks= await query;

        res.status(200).json({
            success:true,
            count: feedbacks.length,
            data: feedbacks
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false, message:"Cannot find Feedback"});
    }
};

//@desc     Get single feedback
//@route    Get /api/v1/feedbacks/:id
//@access   Public
exports.getFeedback = async (req,res,next)=>{
    try{
        const feedback = await Feedback.findById(req.params.id).populate({
            path: 'company',
            select: 'name description tel'
        });

        if(!feedback){
            return res.status(404).json({success:false,message:`No feedback with the id of ${req.params.id}`});
        }

        res.status(200).json({
            success:true,
            data: booking
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find feedback"});
    }
}

//@desc     Add feedback
//@route    POST /api/v1/bookings/:bookingID/feedbacks/
//@access   Private
exports.addFeedback = async (req,res,next)=>{
    
    try{
        req.body.booking = req.params.bookingId;

        if (!mongoose.Types.ObjectId.isValid(req.params.bookingId)) {
            return res.status(400).json({ error: "Invalid booking ID" });
          }
        
          const booking = await Booking.findOne({
            _id: req.params.bookingId,
            user: req.user.id
          });
        
          if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
          }

        //add user Id to req.body
        req.body.user=req.user.id;

        const bookDate = new Date(req.body.bookDate);
        const createAt = new Date.now;
        if (createAt < bookDate) {
            return res.status(400).json({
                success: false,
                message: 'You can feedback only after the interview'
            });
        }

        const feedback = await Feedback.create(req.body);

        res.status(200).json({
            success: true,
            data: feedback
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot create Feedback"});
    }
};

//@desc     Update feedback
//@route    PUT /api/v1/feedbacks/:id
//@access   Private
exports.updateFeedback=async (req,res,next)=>{
    try{
        let feedback= await Feedback.findById(req.params.id);

        if(!feedback){
            return res.stataus.json({success:false,message:`No feedback with the id of ${req.params.id}`});
        }

        //Make sure user is the feedback owner
        if(feedback.user.toString()!== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this feedback`});
        }

        feedback=await Feedback.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });

        res.status(200).json({
            success:true,
            data: feedback
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot update feedback"});
    }
};

//@desc     Delete feedback
//@route    Delete /api/v1/feedbacks/:id
//@access   Private
exports.deleteFeedback=async (req,res,next)=>{
    try{
        const feedback= await Feedback.findById(req.params.id);
        if(!feedback){
            return res.status(404).json({success:false,message:`No feedback with the id of ${req.params.id}`});
        }

        //Make sure user is the feedback owner
        if(feedback.user.toString()!== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this feedback`});
        }
        await feedback.deleteOne();

        res.status(200).json({
            success:true,
            data:{}
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot delete feedback"});
    }
};