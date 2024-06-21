import React from 'react'
import { file_url } from '../../setting'
import { Link } from 'react-router-dom'


function DCourseCard({course}) {
  return (
    <div className='h-56  bg-gray-200' >
      <img className='w-full h-3/4 ' src={file_url+course?.image} alt="" />

    <center className='h-1/4' >
    <div className='w-full  p-3 text-white bg h-full  ' >
        <a href={'/dashboard/course/'+course._id} className=' w-full' >{course.name}</a>
      </div>
    </center>
     
      
    </div>
  )
}

export default DCourseCard