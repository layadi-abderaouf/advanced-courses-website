import React from 'react'
import { file_url, main_color } from '../setting'
import { Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getcart, set_cart } from '../storage/cart'


function CourseCard({course}) {
  const cart = useSelector(getcart)
  const dispatch = useDispatch()

  //functiions
  function add_to_cart(){
    dispatch(set_cart([...cart,course]))
  }
  return (
    <div className='bg-white w-full md:flex rounded-lg  p-2 ' >

       
        <img className='md:w-1/3 sm:mb-2 mr-6 rounded-lg md:h-full'  src={file_url+course.image} alt="" />
        <div className='w-full ' >
          <div className='w-full flex justify-between'  >

            <div>
              <div className='flex ' >
              <Link to={'/course/'+course._id} className='font-bold w-full text-2xl' >{course?.name}  </Link >
              <p className='text-gray-400 mt-1 ml-2 text-lg' >{(course?.duration /3600).toFixed(1)}Hours</p>
              </div>
           
            <h1 className=' text-lg text-gray-400' >{course?.category?.name} . by : {course?.user_id?.name}  </h1>
            </div>
             <div>
              {course.type === 'rdiploma' && (
                <Button  size={2} padding={4}  marginTop={1} colorScheme={"white"} background={'yellow.700'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>

               </Button>
              )}
            
            <Button  onClick={add_to_cart} marginLeft={{sm:2}} size={2} padding={4}  marginTop={1} colorScheme={"white"} background={main_color}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>

            </Button>
             </div>
           
          </div>
  
           <div className='text-gray-500 mt-4' >
            {course.description.substring(0,125)} ...
           </div>


            <div className='flex justify-between w-full' >
              <h1 className='text-2xl font-bold mt-2 mb-auto' >{course?.price === 0 ? 'Free' : course?.price + '$'}</h1>
           
            </div>
        
        </div>
      
        
    </div>
  )
}

export default CourseCard