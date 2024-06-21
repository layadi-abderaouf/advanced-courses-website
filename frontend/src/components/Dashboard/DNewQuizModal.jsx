import React,{useState,useEffect} from 'react'
import { IconButton } from '@chakra-ui/button'
import {
    Modal,ModalOverlay,ModalContent,
    ModalHeader,ModalBody,ModalCloseButton,
    useToast,FormControl,Button
  } from '@chakra-ui/react'
import {useDisclosure} from '@chakra-ui/hooks'
import axios from 'axios'
import { api_url, main_color } from '../../setting'
import { useSelector } from 'react-redux'
import { getuser } from '../../storage/user'
import { useNavigate } from 'react-router-dom'


function DNewQuizModal({children,course_id,section_id,_refresh}) {
    
    const user = useSelector(getuser)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
  
    //state
    const [name, setname] = useState('')

   
   
    
    
    
   //functions
   async function new_quiz(){
  


    // e.preventDefault()
    
     if (!name ){
        toast({
           title: 'please fill the name !',
           status: 'error',
           duration: 5000,
           isClosable: true,
           position:'bottom'
         })  
  
       return; 
    } 
 
     try {
      
        const config = {
            headers : {
              "content-type":"application/json",
              "Authorization":"Bearer "+user.token, 
            }
          };
     
       
        await axios.post(api_url+'/course/content/quiz',{name,course_id,section_id},config).then((response)=>{
                toast({
                    title: 'quiz created successfully !',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position:'bottom'
                  })  
                _refresh()
                onClose()
                return;
            }).catch((err)=>{
                toast({
                    title: 'error !',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position:'bottom'
                  })  
               
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
       
        return; 
     }
     
     
}

  //body
  return (
    <>
    
    {children? 
       (<button className='p-3 ml-2 bg mb-2 rounded-lg text-white' onClick={onOpen}>{children}</button>):
       (<IconButton d={{base:"flex"}} onClick={onOpen}  />)
    }
    <Modal  isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="work sans" display="flex" justifyContent="center">New Quiz</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
           
           <FormControl>
             <input className='mb-3' value={name} onChange={(ev)=>setname(ev.target.value)}  placeholder=" name"
              />
             
           </FormControl>
          
          
           
         
          <Button background={main_color} colorScheme={"white"} onClick={new_quiz} >Save</Button>
          </ModalBody>

         
        </ModalContent>
      </Modal>
    </>
  )
}

export default DNewQuizModal