import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import { getuser } from '../../storage/user';
import axios from 'axios';
import { api_url } from '../../setting';
import { Button, useToast } from '@chakra-ui/react';
import Text from '../Text';

export default function DCourseSta({course}) {
  const [enrollements, setenrollements] = useState([])
  const user = useSelector(getuser)
  const toast = useToast()

  useEffect(() => {
    const config = {
      headers : {
        "content-type":"application/json",
        "Authorization":"Bearer "+user.token, 
      }
    };
    axios.get(api_url+"/course/stat/enrollments?course_id="+course._id,config).then((response)=>{
      setenrollements(response.data)
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
    <div>
       <div className='p-4 bg-gray-300 w-full m-2' >
         <h1 className='text-xl ' ><Text en={"number of enrollements :"} ar={"عدد المسجلين :"} ></Text><h2 className='ml-12 text-4xl font-bold' >{enrollements.length}</h2></h1>
       </div>
       <div className='m-2 p-2' >
            <h1 className='text-2xl ' >Enrollements :</h1>
            <table  className="mt-7 bg-gray-200 basic" >
              <thead>
                <tr>
                 
                  <td className='text-white' ><Text en="name" ar="اسم المتعلم" ></Text></td>
                  <td className='text-white' ><Text en="date" ar="التاريخ"/></td>
                 
                </tr>
              </thead>
              <tbody>
                {enrollements.map((e,i)=>(
                  <tr key={i}>
                   
                    <td>{e?.user?.name}</td>
                
                    <td>{e?.updatedAt} </td>
                   
            
                  
        
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
    </div>
  )
}
