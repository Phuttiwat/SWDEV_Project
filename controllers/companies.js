const Company = require('../models/Company');
const Booking = require('../models/Booking');
const Feedback = require('../models/Feedback');

exports.getCompanies= async (req,res,next)=>{
    let query;

    //Copy req.query
    const reqQuery = {...req.query};

    //Fields to exclude
    const removeFields=['select','sort'];

    //Loop over remove fields and delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);

    //Create query string
    let queryStr = JSON.stringify(reqQuery);

    //Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

    //finding resource
    query = Company.find(JSON.parse(queryStr)).populate({
            path:"bookings",
            select:"bookDate user"
        }).populate({
            path:"feedbacks",
            select:"text user"
        });

    //Select Fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    //Sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else{
        query = query.sort('-createdAt');//Sort by created date
    }
    //Pagination
    const page = parseInt(req.query.page,10)|| 1;
    const limit = parseInt(req.query.limit,10)||25;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    const total = await Company.countDocuments();
    query = query.skip(startIndex).limit(limit);

    try {
        //Executing query
        const companies = await query; 

        //Pagination result
        const pagination = {};

        if(endIndex < total){
            pagination.next = {
                page:page+1,
                limit
            }
        }

        if(startIndex > 0){
            pagination.prev = {
                page:page-1,
                limit
            }
        }
        res.status(200).json({success:true, count:companies.length,
        pagination, data:companies});
    } catch (err) {
        res.status(400).json({success:false});
    }
}
exports.getCompany= async (req,res,next)=>{
    try {
        const company = await Company.findById(req.params.id).populate({
            path: "bookings",
            select: "bookDate user"
        }).populate({
            path: "feedbacks",
            select: "text user"
        });
        if(!company){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true,data:company});
    } catch (err) {
        res.status(400).json({success:false});
    }
}
exports.createCompany= async (req,res,next)=>{
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, data: company });
}
exports.updateCompany= async (req,res,next)=>{
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators:true
        });
        if(!company){
            return res.status(400).json({success:false});
        }
        return res.status(200).json({success:true, data:company});
    } catch (err) {
        return res.status(400).json({success:false});
    }
}
exports.deleteCompany= async (req,res,next)=>{
    try {
        const company = await Company.findById(req.params.id);
        if(!company){
            return res.status(400).json({success:false});
        }
        await Booking.deleteMany({company: req.params.id});
        await Feedback.deleteMany({company: req.params.id});
        await Company.deleteOne({_id: req.params.id});
        return res.status(200).json({success:true, data:{}});
    } catch (err) {
        return res.status(400).json({success:false});
    }
}