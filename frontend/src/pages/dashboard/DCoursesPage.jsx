import React,{useState,useEffect} from 'react'
import DLayout from '../../components/Dashboard/DLayout'
import { api_url } from '../../setting'
import axios from 'axios'
import { SimpleGrid, useToast,Box } from '@chakra-ui/react'
import { getuser } from '../../storage/user'
import { useSelector } from 'react-redux'
import DCourseCard from '../../components/Dashboard/DCourseCard'
import { Link } from 'react-router-dom'



function DCoursesPage() {
  const toast = useToast()
  const user = useSelector(getuser)
  const [courses, setcourses] = useState([])
  useEffect(() => {
    axios.get(api_url+'/course?is_teacher=1&user='+user._id).then((response)=>{
      
      setcourses(response.data)
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
   
  }, [])
  return (
    <DLayout>
      <h1 className='text-3xl font-bold mb-6' >My Courses</h1>
      <SimpleGrid columns={{lg:4,md:3,sm:2}} spacing={4} >
      <Link to={'/dashboard/newcourses'} className='bg-gray-300 h-56  rounded-lg' >
        <h1 className='m-auto  center text-4xl ' >
          <center className=' mt-20' >
               New Course
          </center>
          
        </h1>
      </Link>
      {courses.map((c)=>(
        <DCourseCard key={c._id}  course={c}></DCourseCard>
        
      ))}
      </SimpleGrid>
      
    </DLayout>
  )
}

export default DCoursesPage