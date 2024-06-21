//the functions here is login - register
const express = require('express')
const {register,login,become_teacher,update_user,change_password, get_teacher} = require('../controllers/userController');
const { user_required } = require('../middleware/authorization');


const router = express.Router()

//post routes
router.post('/register',register);
router.post('/login',login);
router.post('/become-teacher',user_required,become_teacher);
router.post('/update',user_required,update_user)
router.post('/change-password',user_required,change_password)

//get routes
router.get('/teacher',get_teacher)

module.exports = router;