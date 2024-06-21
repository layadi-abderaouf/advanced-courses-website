const express = require('express')

const { user_required } = require('../middleware/authorization');
const { get_chats ,get_messages,new_chat,new_message,delete_chat} = require('../controllers/chatController');


const router = express.Router()

//get routes
router.get('/',user_required,get_chats);
router.get('/messages',user_required,get_messages);


//post routes
router.post('/',user_required,new_chat)
router.post('/message',user_required,new_message)

//delete routes
router.delete('/delete',user_required,delete_chat)

module.exports = router;