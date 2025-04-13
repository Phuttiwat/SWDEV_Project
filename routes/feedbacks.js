const express = require('express');
const {getFeedbacks,getFeedback,addFeedback,updateFeedback,deleteFeedback}  = require('../controllers/feedbacks');

const router = express.Router({mergeParams:true});

const {protect,authorize} = require('../middleware/auth');

router.route('/').get(getFeedbacks).post(protect,addFeedback);
router.route('/:id').get(getFeedback).put(protect,updateFeedback).delete(protect,deleteFeedback);
module.exports = router;