import React,{useState,useEffect} from 'react'
import ShcoolLayout from '../components/ShcoolLayout'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { api_url, file_url } from '../setting'
import { Modal, ModalBody, ModalCloseButton,ModalHeader,ModalOverlay,
   ModalContent, useDisclosure, useToast,ModalFooter,Button
   } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { getuser } from '../storage/user'


function QuizPage() {
  const user = useSelector(getuser)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {quiz_id} = useParams()
  const toast = useToast()
  const [quiz, setquiz] = useState({})
  const [questions, setquestions] = useState([])
  const [answers, setanswers] = useState([])
  const [score, setscore] = useState([0,0,0])
  const answers_ = ["A","B","C","D","E","F","G","H","I","G","K"]
  useEffect(() => {
    axios.get(api_url+"/course/content/quiz?quiz_id="+quiz_id).then((response)=>{
       setquiz(response.data)
      
    }).catch((err)=>{
      toast({
        title: 'error!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      }) 
      return; 
    })

    axios.get(api_url+"/course/content/question?quiz_id="+quiz_id).then((response)=>{
      setquestions(response.data)
      setanswers(new Array(response.data.length).fill(""))
   }).catch((err)=>{
     toast({
       title: 'error!',
       status: 'error',
       duration: 5000,
       isClosable: true,
       position:'bottom'
     }) 
     return; 
   })
   
 
   
  }, [])
  function select_answer(value,index){
     var array = [...answers]
     array[index] = value
     setanswers(array)
     console.log(answers);
  }
  async function send(){
  
     if(answers.includes("")){
      toast({
        title: 'please answer all questions',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      }) 
      return; 
     }
  
     const q_length = answers.length
     var score = 0;
     answers.forEach((a,i)=>{
      if(a === questions[i]?.right_answer){
        score += 1;
      }
     })
     var average = score * 100 / q_length
     setscore([average,score,q_length])
     if(average >= 70){
      
      if(quiz.is_final){
        
        var is_local_course = true;
        if(quiz.course.type === "diploma"){
          is_local_course = false
        }
        const config = {
          headers : {
            "content-type":"application/json",
            "Authorization":"Bearer "+user.token, 
          }
      }
        await axios.post(api_url+"/course/content/certaficate",{course_id:quiz.course._id,is_local_course,degree:average},config).then((response)=>{
          return;
        }).catch((err)=>{
          toast({
            title: 'error',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          }) 
          return; 
       })
      }
     
       onOpen()
     }else{
       onOpen()
     }
  }
  return (
    <ShcoolLayout>

      <div>
      <h1 className='text-3xl font-bold p-4 ' >{quiz.is_final ? "The final test" : quiz.name + "(Quiz)"} </h1>
      {questions?.map((q,i)=>(
        <div key={i} className='p-4 m-2 bg-gray-200'>
          <h1 className='text-xl mb-2 ' >{i+1}/ {q.question}</h1>
          {q.image && (
            <img className='w-full  rounded-lg' src={file_url+q.image} alt="" />
          )}
          {q.answers?.map((a,index)=>(
            <h2 key={index} className='text-gray-400 text-lg px-6 py-2' >{answers_[index]}/ {a}</h2>
          ))}
          <h3 className='mt-2 font-bold' >the right answer :</h3>
          <select value={answers[i]} onChange={(ev)=>select_answer(ev.target.value,i)}  className='bg2 text-white' name="" id="">
            <option value="">select answer</option>
            {q.answers?.map((a,index)=>(
              <option key={index} className='text-white' value={a}>{answers_[index]}</option>
            ))}
          </select>
        </div>
      ))}
      <button onClick={()=>send()} className='btn w-full' >send answers</button>
      </div>






      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{score[0] > 70 ? "Congratulations, you passed the test!" : "Unfortunately, you failed the test"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          You have answered {score[1]} out of {score[2]} questions on average {score[0]}%
          </ModalBody>
          <ModalFooter>
            <Button colorScheme={score[0] > 70 ? "green" : "red"} mr={3} onClick={onClose}>
            {score[0] > 70 ? "green" : "Try Again"}
            </Button>
           
          </ModalFooter>
         
        </ModalContent>
      </Modal>
    
    </ShcoolLayout>
  )
}

export default QuizPage