//the functions here is login - register
const express = require('express')
const { user_required } = require('../middleware/authorization');
const { checkout, webhook } = require('../controllers/paymentController');
const bodyParser = require('body-parser');


const router = express.Router()

//post routes
router.post('/',user_required,checkout);
//router.post('/webhook',express.json({ type: "application/json" }),webhook);




module.exports = router;