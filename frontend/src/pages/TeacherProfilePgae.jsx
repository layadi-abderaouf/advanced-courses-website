import { Avatar, Grid, SimpleGrid, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api_url, file_url } from '../setting'
import Navbar from '../components/Navbar'
import CourseCard from '../components/CourseCard'
import { useSelector } from 'react-redux'
import { getuser } from '../storage/user'
import Footer from '../components/Footer'



function TeacherProfilePgae() {
  const {id} = useParams()
  const toast = useToast()
  const user = useSelector(getuser)
  const navigate = useNavigate()
  const [teacher, setteacher] = useState()
  const [courses, setcourses] = useState([])
  useEffect(() => {
    
  axios.get(api_url+'/user/teacher?id='+id).then((response)=>{
    setteacher(response.data)

    axios.get(api_url+'/course?user='+response.data.user_id).then((res)=>{
      setcourses(res.data)
    
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

  async function new_chat(){
    if(!user){
      return navigate('/login')
    }
    const config = {
      headers : {
        "content-type":"application/json",
        "Authorization":"Bearer "+user.token, 
      }
    };
    try {
      await axios.post(api_url+'/chat',{user_id:teacher.user_id},config).then((response)=>{
          return navigate('/chat')
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
    } catch (error) {
      toast({
        title: 'error!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      }) 
      return; 
    }
  }
  
  return (
    <div>
       <Navbar></Navbar>
       <Grid marginTop={4} templateColumns={{md:"0.5fr 1.5fr",sm:"2fr"}} gap={2} >
          <div className='bg-gray-200 mx-2 ' >
            <center className='mt-8' >
            <Avatar size={"2xl"} src={file_url+teacher?.image} ></Avatar>
            <h1 className='text-2xl font-bold mt-2' >{teacher?.user_name}</h1>
            <button onClick={new_chat} className='btn mt-1' >send message</button>
            <p className='text-lg text-gray-400 mt-2 p-1' >{teacher?.description}</p>
            </center>
             
          </div>
          <div className='mx-1' >
              <div className='p-4 mb-2  text-2xl bg-gray-200' >{teacher?.user_name} courses :</div>
              <div className='p-4 bg-gray-200' >
              <SimpleGrid  columns={1} spacing={4}>
                {courses?.map((c)=>(
                 
                    <CourseCard key={c._id} course={c} />
                 
                 
                 ))}
               </SimpleGrid>
                
              </div>
          </div>
       </Grid>
       <Footer></Footer>
    </div>
  )
}

export default TeacherProfilePgae