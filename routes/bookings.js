const express = require('express');
const {getBookings, getBooking, addBooking, updateBooking, deleteBooking}  = require('../controllers/bookings');
const feedbackRouter = require('./feedbacks');
const router = express.Router({mergeParams:true});

const {protect,authorize} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:bookingId/feedbacks/', feedbackRouter);

router.route('/').get(protect, getBookings).post(protect,addBooking);
router.route('/:id').get(getBooking).put(protect,updateBooking).delete(protect,deleteBooking);
module.exports = router;