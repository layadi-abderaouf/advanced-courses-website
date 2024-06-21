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


function DUpdateVideoModal({children,video}) {
    
    const user = useSelector(getuser)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    const navigate = useNavigate()
    //state
    const [name, setname] = useState('')
    const [description, setdescription] = useState('')
    const [loading, setloading] = useState(false)
   
    useEffect(() => {
      
    setname(video.name)
    setdescription(video.description)
     
    }, [])
    
    
    
   //functions
   async function update_video(){
    setloading(true)


    // e.preventDefault()
    
     if (!name ){
        toast({
           title: 'please fill the name !',
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
     
       
        await axios.patch(api_url+'/course/content/video',{name,description,video_id:video._id},config).then((response)=>{
                toast({
                    title: 'video created successfully !',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position:'bottom'
                  })  
                setloading(false)
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
          <ModalHeader fontSize="35px" fontFamily="work sans" display="flex" justifyContent="center">Edit Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
           
           <FormControl>
             <input className='mb-3' value={name} onChange={(ev)=>setname(ev.target.value)}  placeholder=" name"
              />
             
           </FormControl>
           <FormControl>
           <textarea placeholder='description'  value={description} onChange={(ev)=>setdescription(ev.target.value)} ></textarea>
             
           </FormControl>
          
           
         
          <Button background={main_color} colorScheme={"white"} onClick={update_video} >Save</Button>
          </ModalBody>

         
        </ModalContent>
      </Modal>
    </>
  )
}

export default DUpdateVideoModal