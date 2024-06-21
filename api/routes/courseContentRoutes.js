//the functions here is login - register
const express = require('express')
const { user_required, teacher_required } = require('../middleware/authorization');
const { new_section, update_section,get_video,get_comments,new_comment,
     new_quiz,update_quiz,delete_quiz,get_quiz,
     delete_section, getsection, new_video ,update_video,delete_video,
      new_question, get_questions, update_question, delete_question, new_certafication
    } = require('../controllers/courseContentController');



const router = express.Router()

//post routes
router.post('/section',teacher_required,new_section);
router.post('/video',teacher_required,new_video)
router.post('/quiz',teacher_required,new_quiz)
router.post('/question',teacher_required,new_question)
router.post('/certaficate',user_required,new_certafication)
router.post('/comment',user_required,new_comment)
//get routes
router.get('/section',getsection)
router.get('/video',get_video)
router.get('/quiz',get_quiz)
router.get('/question',get_questions)
router.get('/comment',get_comments)
//patch route
router.patch('/section',teacher_required,update_section)
router.patch('/video',teacher_required,update_video)
router.patch('/quiz',teacher_required,update_quiz)
router.patch('/question',teacher_required,update_question)
//delete route
router.delete('/section',teacher_required,delete_section)
router.delete('/video',teacher_required,delete_video)
router.delete('/quiz',teacher_required,delete_quiz)
router.delete('/question',teacher_required,delete_question)



module.exports = router;