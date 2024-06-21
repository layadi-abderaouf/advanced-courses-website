import React,{useState,useEffect} from 'react'
import DLayout from '../../components/Dashboard/DLayout'
import { useSelector } from 'react-redux'
import { getuser } from '../../storage/user'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { api_url } from '../../setting'
import { useToast } from '@chakra-ui/react'


function DHomePage() {
    const user  = useSelector(getuser)
    const navigate = useNavigate()
    const toast = useToast()
    const [total_value, settotal_value] = useState(0)
    const [course_number, setcourse_number] = useState(0)
    const [enroll_number, setenroll_number] = useState(0)
    const [transactions, settransactions] = useState([])
    useEffect(() => {
        if(!user){
          return navigate('/login')
        }
        const config = {
            headers : {
              "content-type":"application/json",
              "Authorization":"Bearer "+user?.token, 
            }
          };
      axios.get(api_url+"/course/stat/transactions",config).then((response)=>{
      
        var total = 0;
      
        response.data.map((t)=>{
           total += t.value;
        })
        settotal_value(total)
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

      axios.get(api_url+"/course/stat/enrollments",config).then((response)=>{
        setenroll_number(response.data.enroll)
        setcourse_number(response.data.courses)
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
  return (
    <DLayout>
        <h1 className='text-3xl font-bold' >Welcome to Champ Dashboard</h1>
        <div className='p-4 m-4 bg-gray-300 flex justify-between' >
           <h1 className='text-2xl ' >Available balance : <h1 className='text-3xl font-bold ml-12' >{total_value.toFixed(2)}$</h1></h1>
           <Link to={'/dashboard/payments'} className='btn' >
            <h1 className='text-xl mt-2' >Go to Payment page</h1>
            </Link>
        </div>
        <div className='p-4 m-4 bg-gray-300 flex justify-between' >
           <h1 className='text-2xl ' >Number of Courses : <h1 className='text-3xl font-bold ml-12' >{course_number}</h1></h1>
           <Link  to={'/dashboard/courses'} className='btn' >
            <h1 className='text-xl mt-2' >Go to Courses page</h1></Link>
        </div>
        <div className='p-4 m-4 bg-gray-300 flex justify-between' >
           <h1 className='text-2xl ' >Number of Enrollements : <h1 className='text-3xl font-bold ml-12' >{enroll_number}</h1></h1>
        
        </div>
    </DLayout>
  )
}

export default DHomePage