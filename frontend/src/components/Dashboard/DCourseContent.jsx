import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { api_url, file_url, main_color } from '../../setting'
import { useToast,Accordion,AccordionPanel,AccordionItem,
  AccordionButton,Box,AccordionIcon,SimpleGrid} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { getuser } from '../../storage/user'
import DNewVideoModal from './DNewVideoModal'
import DUpdateVideoModal from './DUpdateVideoModal'
import DNewQuizModal from './DNewQuizModal'
import DCourseCard from './DCourseCard'
import { Link } from 'react-router-dom'
import DUpdateQuizModal from './DUpdateQuizModal'



function DCourseContent({course}) {
  const toast = useToast()
  const user = useSelector(getuser)
  const [children_course, setchildren_course] = useState([])
  const [my_courses, setmy_courses] = useState([])
  const [sections, setsections] = useState([])
  const [videos, setvideos] = useState([])
  const [quizs, setquizs] = useState([])
  const [finale_exam, setfinale_exam] = useState({})
  const [refresh, setrefresh] = useState(false)
  const [section_name_edit, setsection_name_edit] = useState('')
  const [is_edited, setis_edited] = useState(false)
  const [section_name, setsection_name] = useState('')
  useEffect(() => {
     
    axios.get(api_url+'/course/content/quiz?is_final=55&course_id='+course._id).then((response)=>{
      
      setfinale_exam(response.data[0])
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

    if(course?.type === "diploma"){
      axios.get(api_url+'/course?is_teacher=1&diploma='+course._id).then((response)=>{
        setchildren_course(response.data)
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
      axios.get(api_url+'/course?is_teacher=1&user='+user._id).then((response)=>{
        setmy_courses(response.data)
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
    }else{
      axios.get(api_url+'/course/content/section?course_id='+course?._id).then((response)=>{
        setsections(response.data)
      }).catch((err)=>{
        toast({
          title: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        }) 
        return;
      })

      axios.get(api_url+'/course/content/quiz?course_id='+course?._id).then((response)=>{
        setquizs(response.data)
        
      }).catch((err)=>{
        toast({
          title: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        }) 
        return;
      })

      axios.get(api_url+'/course/content/video?course_id='+course._id).then((res)=>{
        setvideos(res.data)
       
       }).catch((err)=>{
         toast({
           title: 'error !!!!',
           status: 'error',
           duration: 5000,
           isClosable: true,
           position:'bottom'
         }) 
         return;
       })
     
    }
    
    ;
   
  }, [refresh])
  
  //functions
  function add_video(video){
    setvideos([...videos,video])
  }

  async function new_section(){
    if(!section_name){
      toast({
        title: 'section name empty!',
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
      await axios.post(api_url+'/course/content/section',{name:section_name,course_id:course._id},config).then((response)=>{
        setsections([...sections,response.data])
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

  async function add_children(id){
    if(id == "0"){
      return; 
    }
    try {
      const config = {
        headers : {
          "content-type":"application/json",
          "Authorization":"Bearer "+user.token, 
        }
      };
      await axios.post(api_url+'/course/add-children',{course_id:id,parent:course._id},config).then((response)=>{
        toast({
          title: 'course added !',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        }) 
        setrefresh(!refresh)
        return; 
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

  async function delete_video(id,is_quiz=false){
    try {
      const config = {
        headers : {
          "content-type":"application/json",
          "Authorization":"Bearer "+user.token, 
        }
      };
      if(is_quiz){
        await axios.delete(api_url+'/course/content/quiz?quiz_id='+id,config).then((response)=>{
          setrefresh(!refresh)
          toast({
           title: 'quiz deleted!',
           status: 'success',
           duration: 5000,
           isClosable: true,
           position:'bottom'
         }) 
         return; 
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
      }else{
        await axios.delete(api_url+'/course/content/video?video_id='+id,config).then((response)=>{
          setrefresh(!refresh)
          toast({
           title: 'video deleted!',
           status: 'success',
           duration: 5000,
           isClosable: true,
           position:'bottom'
         }) 
         return; 
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
      }
    
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

  async function update_section(id){
    try {
      const config = {
        headers : {
          "content-type":"application/json",
          "Authorization":"Bearer "+user.token, 
        }
      };
      await axios.patch(api_url+'/course/content/section',{section_id:id,name:section_name_edit},config).then((response)=>{
         setrefresh(!refresh)
         toast({
          title: 'section updated!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        }) 
        setis_edited(!is_edited)
        return; 
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

  async function delete_section(id){
    try {
      const config = {
        headers : {
          "content-type":"application/json",
          "Authorization":"Bearer "+user.token, 
        }
      };
      await axios.delete(api_url+'/course/content/section?section_id='+id,config).then((response)=>{
         setrefresh(!refresh)
         toast({
          title: 'section deleted!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        }) 
        return; 
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

  function _refresh(){
    setrefresh(!refresh)
  }


  if(course.type === "diploma"){
    return (
      <div>
      
         <SimpleGrid columns={{lg:4,md:3,sm:2}} spacing={4} >
      <Link to={'/dashboard/newcourses?id='+course._id} className='bg-gray-300 h-62
        rounded-lg' >
        <h1 className='m-auto  center text-4xl ' >
          <center className=' mt-20' >
               New childeren Course
          </center>
          
        </h1>
      </Link>
      <div to={'/dashboard/newcourses?id='+course._id} className='bg-gray-300 h-62  rounded-lg' >
        <h1 className='m-auto  center text-4xl ' >
          <center className=' mt-16' >
               Add Exist course
               <select onChange={(ev)=>add_children(ev.target.value)} className=' w-3/4 mt-1' name="" id="">
               <option value="0">none</option>
                {my_courses?.map((c)=>(
                  <>
                 
                  {!c.parent && c.type === 'simple' && (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  )}
                    
                    </>

                ))}
               </select>
          </center>
          
        </h1>
      </div>
      {children_course.map((c)=>(
        <div>
        <button onClick={()=>add_children(c._id)} className='w-full bg-red-700 text-white ' >delete</button>
        <DCourseCard key={c._id}  course={c}></DCourseCard>
        </div>
        
      ))}
      </SimpleGrid>
        <div className='p-4 mt-2 flex justify-between bg-gray-400' >
          <h1 className='text-3xl text-white' >{finale_exam?.name}</h1>
          {finale_exam?._id && (
  <DUpdateQuizModal quiz={finale_exam} >Edit</DUpdateQuizModal>
          )}
        
        </div>
      </div>
    )
  }
  return (
    <div>
     
       <Accordion  allowMultiple>
                {sections?.map((s,i)=>(<div key={i} >
                  
                  <AccordionItem key={i} >
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                           <div className='flex ' >
                            
                            <div className='flex w-full justify-between' >
                                  
                                    <h1 className='text-xl text-gray-400 font-bold' > {s.name}</h1>
                                    
                                     
                                      <div className='flex' >
                                      <button onClick={()=>{setsection_name_edit(s.name) ;setis_edited(!is_edited)}} className='px-3 bg mb-2 text-white rounded-lg' >{is_edited ? "Cencel":"Edit"}</button>
                                      <button onClick={()=>delete_section(s._id)} className='px-3 mb-2 mr-6 bg-red-600 ml-4 rounded-lg text-white'  >delete</button>
                                      </div> 
                              </div>
                           </div>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <div>
                          {is_edited && (
                             <div className='flex mt-4' >
                             <input placeholder='Section name' className='w-1/2' value={section_name_edit} onChange={(ev)=>setsection_name_edit(ev.target.value)} type="text" />
                             <button className='ml-4 btn' onClick={()=>update_section(s._id)} >save</button>
                            </div> 
                          )}
                           
                            {videos?.map((v,index)=>(
                                <div key={index} >
                                  {v.section === s._id && (
                                    <div className='flex justify-between' >
                                      <h1 className="ml-2 p-1 text-lg" > {v?.name}</h1>
                                      <div className='flex' >
                                      <DUpdateVideoModal video={v} >Edit</DUpdateVideoModal>
                                      <button onClick={()=>delete_video(v._id)} className='px-3 mb-2 bg-red-600 ml-4 rounded-lg text-white'  >delete</button>
                                      </div> 
                                     
                                    </div>
                                    
                                  )}            
                                </div>
                              
                            ))}
                             {quizs?.map((q,index)=>(
                                <div key={index} >
                                  {q.section === s._id && (
                                    <div className='flex justify-between' >
                                      <h1 className="ml-2 p-1 text-lg" > {q?.name} (quiz)</h1>
                                      <div className='flex' >
                                      <DUpdateQuizModal quiz={q} >Edit</DUpdateQuizModal>
                                      <button onClick={()=>delete_video(q._id,true)} className='px-3 mb-2 bg-red-600 ml-4 rounded-lg text-white'  >delete</button>
                                      </div> 
                                     
                                    </div>
                                    
                                  )}            
                                </div>
                              
                            ))}
                            <div>
                            <DNewVideoModal add={add_video} section={s} className='btn mt-2' >new video</DNewVideoModal>
                            <DNewQuizModal _refresh={_refresh} section_id={s._id} course_id={course._id} className='btn ml-2 mt-2' >new quiz</DNewQuizModal>
                            </div>
                           
                        </div>
                    </AccordionPanel>
                  </AccordionItem>
                   </div>))}
                   <div className='flex mt-4' >
                     <input placeholder='Section name' className='w-1/2' value={section_name} onChange={(ev)=>setsection_name(ev.target.value)} type="text" />
                     <button className='ml-4 btn' onClick={new_section} >new section</button>
                   </div>

                 
                </Accordion>
                <div className='p-4 mt-4 flex justify-between bg-gray-300 text-2xl' >
                    {finale_exam?.name}
                    {finale_exam?._id && (
                      <DUpdateQuizModal quiz={finale_exam} >edit</DUpdateQuizModal>
                    )}
                    
                </div>
    </div>
  )
}

export default DCourseContent