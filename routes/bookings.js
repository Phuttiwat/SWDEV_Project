const express = require('express');

const {getBookings, getBookingsByDate, getBooking, addBooking, updateBooking, deleteBooking}  = require('../controllers/bookings');
const feedbackRouter = require('./feedbacks');
const router = express.Router({mergeParams:true});

const {protect} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:bookingId/feedbacks/', feedbackRouter);

router.route('/').get(protect, getBookings).post(protect,addBooking);
router.route('/:id').get(protect, getBooking).put(protect,updateBooking).delete(protect,deleteBooking);
router.route('/date/:date').get(protect,getBookingsByDate);
module.exports = router;