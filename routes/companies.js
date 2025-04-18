const express = require('express');
const {getCompanies,getCompany,createCompany,updateCompany,deleteCompany}=require('../controllers/companies.js')
//Include other resource routers
const bookingRouter = require('./bookings')
const feedbackRouter = require('./feedbacks')
const router = express.Router();

const {protect,authorize} = require('../middleware/auth.js');

//Re-route into other resource routers
router.use('/:companyId/bookings/',bookingRouter);
router.use('/:companyId/feedbacks/',feedbackRouter);

router.route('/').get(getCompanies).post(protect,authorize('admin'),createCompany);
router.route('/:id').get(getCompany).put(protect,authorize('admin'),updateCompany).delete(protect,authorize('admin'),deleteCompany);

module.exports=router;