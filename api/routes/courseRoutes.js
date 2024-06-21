//the functions here is login - register
const express = require('express')
const {create_course,get_courses, deploy,update_course,free_enroll,add_children,is_enroll, get_user_enrollemnt, get_user_certification} = require('../controllers/courseController');
const { user_required, teacher_required } = require('../middleware/authorization');
const { get_category } = require('../controllers/categoryController');
const { get_enrollements, get_transaction } = require('../controllers/statController');


const router = express.Router()

//post routes
router.post('/new',teacher_required,create_course);
router.post('/free-enroll',user_required,free_enroll);
router.post('/add-children',teacher_required,add_children);
router.post('/is-enroll',user_required,is_enroll)
router.post('/deploy',teacher_required,deploy)
//get routes
router.get('/',get_courses)
router.get('/enrollemnts',user_required,get_user_enrollemnt)
router.get('/user-certifications',user_required,get_user_certification)
router.get('/category',get_category)
router.get('/stat/enrollments',teacher_required,get_enrollements)
router.get('/stat/transactions',teacher_required,get_transaction)
//patch route
router.patch('/',teacher_required,update_course)



module.exports = router;