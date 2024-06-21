import React,{useState,useEffect} from 'react'
import { IconButton } from '@chakra-ui/button'
import {
    Modal,ModalOverlay,ModalContent,
    ModalHeader,ModalBody,ModalCloseButton,AccordionItem,Box,AccordionIcon,
    useToast,FormControl,Button,Accordion,AccordionButton,AccordionPanel
  } from '@chakra-ui/react'
import {useDisclosure} from '@chakra-ui/hooks'
import axios from 'axios'
import { api_url, file_url, main_color } from '../../setting'
import { useSelector } from 'react-redux'
import { getuser } from '../../storage/user'
import { useNavigate } from 'react-router-dom'


function DUpdateQuizModal({children,quiz}) {
    
    const user = useSelector(getuser)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    const navigate = useNavigate()
    //state
    const [refresh, setrefresh] = useState(false)
    const [questions, setquestions] = useState([])
    const [question, setquestion] = useState()
    const [image, setimage] = useState('')
    const [file, setfile] = useState()
    const [answer_input, setanswer_input] = useState('')
    const [answers, setanswers] = useState([])
    const [right_answer, setright_answer] = useState('')
    const [loading, setloading] = useState(false)
   
    useEffect(() => {
      
      axios.get(api_url+'/course/content/question?quiz_id='+quiz._id).then((response)=>{
        setquestions(response.data)
      })
     
    }, [refresh])

    useEffect(() => {
      
    if(file){
        uploadImages()
    }
    
    }, [file])
    
    
    
    
   //functions
   async function new_question(){
    setloading(true)


    // e.preventDefault()
    
     if (!question || !answers || !right_answer){
        toast({
           title: 'please fill requireq field !',
           status: 'error',
           duration: 5000,
           isClosable: true,
           position:'bottom'
         })  
       setloading(false)
       return; 
    } 
 
     try {
      
        const config = {
            headers : {
              "content-type":"application/json",
              "Authorization":"Bearer "+user.token, 
            }
          };
     
        console.log(question,image,answers,right_answer,quiz._id);
        await axios.post(api_url+'/course/content/question',{question,image,answers,right_answer,quiz_id:quiz._id},config).then((response)=>{
                toast({
                    title: 'question created successfully !',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position:'bottom'
                  })  
                setloading(false)
                setquestion('')
                setanswers([])
                
                setrefresh(!refresh)
                return;
            }).catch((err)=>{
                toast({
                    title: 'error !',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position:'bottom'
                  })  
                setloading(false)
                return; 
            })
        
     
     } catch (err) {
        toast({
            title: 'error !',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          })  
        setloading(false)
        return; 
     }
     
     
}
async function delete_question(id){
  

     try {
      
        const config = {
            headers : {
              "content-type":"application/json",
              "Authorization":"Bearer "+user.token, 
            }
          };
     
        
        await axios.delete(api_url+'/course/content/question?question_id='+id,config).then((response)=>{
                toast({
                    title: 'question deleted !',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position:'bottom'
                  })  
                setloading(false)
            
                setrefresh(!refresh)
                return;
            }).catch((err)=>{
                toast({
                    title: 'error !',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position:'bottom'
                  })  
                setloading(false)
                return; 
            })
        
     
     } catch (err) {
        toast({
            title: 'error !',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          })  
        setloading(false)
        return; 
     }
     
     
}
async function uploadImages(){
    setloading(true)
    // e.preventDefault()
     if (!file){
         toast({
            title: 'error there is any file !',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          })  
        setloading(false)
        return; 
     } 
 
     try {
       const image = new FormData()
       image.append('file', file)
       await fetch(api_url+'/upload?type=question_img', {
        method: 'POST',
        body: image,
        headers:{
            "enctype":"multiparty/form-data",
            Authorization:'Bearer '+user.token
        }
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Work with the JSON data here
        setimage(data.path.slice(7))
        setloading(false)
        
      })
     } catch (err) {
        toast({
            title: 'error !',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          })  
        setloading(false)
        return; 
     }
     
     
}

function add_ansewer(){
  if(answer_input){
    setanswers([...answers,answer_input])
  }
}

  //body
  return (
    <>
    
    {children? 
       (<button className='px-3 bg mb-2 rounded-lg text-white' onClick={onOpen}>{children}</button>):
       (<IconButton d={{base:"flex"}} onClick={onOpen}  />)
    }
    <Modal  isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="work sans" display="flex" justifyContent="center">Edit quiz</ModalHeader>
          <ModalCloseButton />
         
          <ModalBody width={"full"} display="flex" flexDir="column">
          <h1 className='p-2 text-xl' >Questions</h1>
            {questions.length >= 0 && (
                <>
               
                <Accordion  allowMultiple>
                  {questions?.map((q,i)=>(<div key={i} >
                     
                    <AccordionItem key={i} >
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex='1' textAlign='left'>
                             <div className='flex justify-between' >
                             <h1 className='text-lg font-bold' >{q.question}</h1>
                             <button onClick={()=>delete_question(q._id)} className='px-3 bg-red-700 text-white rounded-lg mr-4' >X</button>
                             </div>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                          <div>
                          <div className='bg-gray-200 rounded-lg p-2 mt-6' >
            
           <FormControl>
            <h1 className='p-2  text-xl' > Question : {q.question}</h1>
             
             
           </FormControl>
           <FormControl>
           <img src={file_url+q?.image} alt="" />
             
           </FormControl>

           <FormControl>
            <h1 className='font-bold' > answers :</h1>
            <div className=' p-2' >
            {answers?.map((a,i)=>(
               <h1 className='text-lg text-gray-500 p-1 ' >{i+1}/ {a}</h1>
            ))}
            </div >
            <div className='flex mb-2' >
                <h1  placeholder='answer' type="text" >the right answer :{q.right_answer}</h1>
               
            </div>
         
           </FormControl>
          
           
         
        
           </div>
                          </div>
                      </AccordionPanel>
                    </AccordionItem>
                     </div>))}
            <AccordionItem>
            <AccordionButton>
                          <Box as="span" flex='1' textAlign='left'>
                             <div className='flex justify-between' >
                             <h1 className='text-lg font-bold' >new question</h1>
                        
                             </div>
                          </Box>
                          <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
            <div className='bg-gray-200 rounded-lg p-2 mt-6' >
           <FormControl>
            <h1 className='p-2  text-xl' >New Question</h1>
             <textarea className='mb-3' value={question} onChange={(ev)=>setquestion(ev.target.value)}  placeholder="question"
              />
             
           </FormControl>
           <FormControl>
           <div className="mb-2 mt-1 " >
                    <label >question image (optional)</label>
                    <label className="shadow bg2 w-full text-white rounded-lg border h-24  flex items-center p-1" >
                        <center className='w-full' >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1 ">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        Upload
                        <input type="file" name="file" onChange={(e) => setfile(e.target.files[0])} className="hidden" />
                        </center>
                      
                    </label>
                </div>
             
           </FormControl>

           <FormControl>
            <div className=' p-2' >
            {answers?.map((a)=>(
               <h1 className='text-lg bg-gray-100 rounded-lg m-1 text-gray-500 p-1 ' > {a}</h1>
            ))}
            </div >
            <div className='flex mb-2' >
                <input value={answer_input} onChange={(ev)=>setanswer_input(ev.target.value)} placeholder='answer' type="text" />
                <button className='p-2  bg text-white  rounded-lg ml-2' onClick={add_ansewer} >add </button>
            </div>
         
           </FormControl>
           <FormControl>
            <label htmlFor="">the right answer</label>
            <select className='mb-2' value={right_answer} onChange={(ev)=>setright_answer(ev.target.value)} name="" id="">
               {answers?.map((a)=>(
                  <option value={a}>{a}</option>
               ))}
            </select>
           </FormControl>
           
         
          <Button isLoading={loading} background={main_color} colorScheme={"white"} onClick={new_question} >Save</Button>
           </div>
           </AccordionPanel>
           </AccordionItem>
                </Accordion>
            </>
            )}
          
           
          </ModalBody>

         
        </ModalContent>
      </Modal>
    </>
  )
}

export default DUpdateQuizModal