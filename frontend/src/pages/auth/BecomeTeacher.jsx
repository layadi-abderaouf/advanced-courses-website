import { Button, Grid ,useToast} from '@chakra-ui/react'
import React,{useState,useEffect} from 'react'
import Navbar from '../../components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { api_url } from '../../setting'
import { getuser, login } from '../../storage/user'
import { useNavigate} from 'react-router-dom'



function  BecomeTeacher() {
    const navigate = useNavigate()
    const toast = useToast()
    const dispatch = useDispatch()
    const user = useSelector(getuser)
    const [file, setfile] = useState()
    const [img, setimg] = useState('')
    const [user_name, setuser_name] = useState('')
    const [description, setdescription] = useState('')
    const [loading, setloading] = useState(false)
    useEffect(() => {
        if(file){
            uploadImages()
        } 
      }, [file])
    if(!user || user == null || user?.is_teacher){
        return toast({
            title: 'you are not login !',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          })   
       }
   
    //functions
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
           await fetch(api_url+'/upload?type=profile_img', {
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
            setimg(data.path.slice(7))
            console.log(data.path);
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
    async function to_teacher(){
        setloading(true)

       if(!user_name ){
        toast({
            title: 'Please enter all required field !',
            status: 'warning',
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
        await axios.post(api_url+"/user/become-teacher",{user_name,description,img},config).then((response)=>{
           
            dispatch(login(response.data))
            toast({
                title: "your teacher now !!",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:'bottom'
              })
              setloading(false)
              navigate('/')
              return;
        }   
        ).catch((err)=>{
            toast({
                title: "error please try later",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:'bottom'
              })
              setloading(false)
              return;
        })
       } catch (error) {
        toast({
            title: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          })
          setloading(false)
          return;
       }
    }
  return (
    <>
    <Navbar></Navbar>
    <center className='px-24 py-12' >
        <Grid className=' bg-gray-200 rounded-lg'  templateColumns={{md:"1fr 1fr",sm:"2fr"}} gap={6}>
            <div className='bg-gray-200 h-96' >
                <h1>Become a teacher with Champ</h1>
            </div>
            <div className='bg-white m-4 rounded-lg p-4' >
               <h1 className='font-bold text-3xl mb-5' >Teacher Information</h1>
               <input className='mb-2' value={user_name} onChange={(ev)=>setuser_name(ev.target.value)} type="email" placeholder='enter your user_name' />
               <textarea className='mb-2'  value={description} onChange={(ev)=>setdescription(ev.target.value)} type="password" placeholder='description' name="" id="" />
               <div className="mb-5 mt-1 " >
                    <label >Photo profile</label>
                    <label className="shadow bg-gray-200 w-full rounded-lg border h-24  flex items-center p-1" >
                        <center className='w-full' >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1 ">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        Upload
                        <input type="file" name="file" onChange={(e) => setfile(e.target.files[0])} className="hidden" />
                        </center>
                      
                    </label>
                </div>
               <Button onClick={to_teacher} isLoading={loading} background={'green.600'} colorScheme='white' >save</Button>
            </div>
        
        </Grid>
       
    </center>
    </>
  )
}

export default BecomeTeacher