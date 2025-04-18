const express = require('express');
const {getFeedbacks,getFeedback,addFeedback,updateFeedback,deleteFeedback}  = require('../controllers/feedbacks');

const router = express.Router({mergeParams:true});

const {protect,authorize} = require('../middleware/auth');

router.route('/').get(protect,getFeedbacks).post(protect,addFeedback);
router.route('/:id').get(protect,getFeedback).put(protect,updateFeedback).delete(protect,deleteFeedback);
module.exports = router;