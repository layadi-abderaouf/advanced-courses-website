import React,{useState,useEffect} from 'react'
import { IconButton } from '@chakra-ui/button'
import {
    Modal,ModalOverlay,ModalContent,
    ModalHeader,ModalBody,ModalCloseButton,
    useToast,FormControl,Spinner
  } from '@chakra-ui/react'
import {useDisclosure} from '@chakra-ui/hooks'
import axios from 'axios'
import { api_url } from '../../setting'
import { useSelector } from 'react-redux'
import { getuser } from '../../storage/user'
import { useNavigate } from 'react-router-dom'


function DNewVideoModal({children,section,add}) {
    
    const user = useSelector(getuser)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    const navigate = useNavigate()
    //state
    const [name, setname] = useState('')
    const [description, setdescription] = useState('')
    const [file, setfile] = useState()
    const [url, seturl] = useState('')
    const [loading, setloading] = useState(false)
   
    useEffect(() => {
      if(file){
        new_video();
      }
   
     
    }, [file])
    
    
   //functions
   async function new_video(){
    setloading(true)


    // e.preventDefault()
     if (!file ){
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
       const video = new FormData()
       video.append('file', file)
       await fetch(api_url+'/upload?type=video', {
        method: 'POST',
        body: video,
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
      .then(async(data) => {
        // Work with the JSON data here
        const config = {
            headers : {
              "content-type":"application/json",
              "Authorization":"Bearer "+user.token, 
            }
          };
        seturl(data.path.slice(7))
      
        await axios.post(api_url+'/course/content/video',{name,description,course_id:section.course,
            url:data.path.slice(8),section_id:section._id,duration:data.duration},config).then((response)=>{
                toast({
                    title: 'video created successfully !',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position:'bottom'
                  })  
                setloading(false)
                add(response.data)
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
       (<button className='btn' onClick={onOpen}>{children}</button>):
       (<IconButton d={{base:"flex"}} onClick={onOpen}  />)
    }
    <Modal  isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="work sans" display="flex" justifyContent="center">Create New Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
           
           <FormControl>
             <input className='mb-3' value={name} onChange={(ev)=>setname(ev.target.value)}  placeholder=" name"
              />
             
           </FormControl>
           <FormControl>
    
           <textarea placeholder='description'  value={description} onChange={(ev)=>setdescription(ev.target.value)} ></textarea>
             {loading && (
                <Spinner color='green.600' size={"lg"} ></Spinner>
             )}
           </FormControl>
           <div className="mb-5 mt-1 w-full  " >
                    <label >video file</label>
                    <label className="shadow bg w-full text-white rounded-lg border h-24  flex items-center p-1" >
                        <center className='w-full' >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1 ">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        Upload and save
                        <input type="file" name="file" onChange={(e) => setfile(e.target.files[0])} className="hidden" />
                        </center>
                      
                    </label>
                </div>
         
          
          </ModalBody>

         
        </ModalContent>
      </Modal>
    </>
  )
}

export default DNewVideoModal