import { Grid, useToast,Accordion,AccordionIcon,AccordionButton,
    AccordionItem,AccordionPanel,SimpleGrid ,Box} from '@chakra-ui/react'
import React,{useState,useEffect} from 'react'
import { api_url, file_url, main_color } from '../setting'
import axios from 'axios'
import { getuser } from '../storage/user'
import { useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import Navbar from './Navbar'


function ShcoolLayout({children}) {
    const user = useSelector(getuser)
    
    const [searchParams] = useSearchParams();
    const parent = searchParams.get('parent')
    const {id,quiz_id} = useParams()
    const toast = useToast()
    const [sections, setsections] = useState([])
    const [quizs, setquizs] = useState([])
    const [final_exam, setfinal_exam] = useState({})
    const [videos, setvideos] = useState([])
    const [course, setcourse] = useState({})
    const [is_enroll, setis_enroll] = useState(false)
    const [children_course, setchildren_course] = useState([])
    const config = {
        headers : {
          "content-type":"application/json",
          "Authorization":"Bearer "+user.token, 
        }
      };
    useEffect(() => {
     
      var data = {course_id:id}
      if(parent){
        data ={course_id:id,parent_id:parent}
      }
      axios.post(api_url+'/course/is-enroll',data,config).then((response)=>{
        setis_enroll(response.data)
        console.log(response.data);
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
    
       axios.get(api_url+'/course/content/section?course_id='+id).then((response)=>{
        setsections(response.data)
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
        
       
      
  
       

       axios.get(api_url+'/course/content/video?course_id='+id).then((response)=>{
        setvideos(response.data)
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
       axios.get(api_url+'/course/content/quiz?course_id='+id).then((response)=>{
        setquizs(response.data)
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
       axios.get(api_url+'/course/content/quiz?is_final=1&course_id='+id).then((response)=>{
        setfinal_exam(response.data[0])
       
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
       axios.get(api_url+'/course?course='+id).then((response)=>{
        setcourse(response.data)
        if(response.data.type == "diploma"){
          axios.get(api_url+'/course?diploma='+id).then((response)=>{
            setchildren_course(response.data)
            console.log(response.data);
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

    if(!is_enroll){
        return (
            <div>enroll first</div>
        )
    }

    if(course.type === "diploma" && !quiz_id){
      return (
        <>
        <Navbar></Navbar>
        <div  >
          
          <center>
          <h1 className='p-2 text-5xl font-bold mt-2 mb-12' >{course.name}</h1>

          
          </center>
          <div className='p-12 m-8 bg-gray-200 rounded-lg' >
          <SimpleGrid   columns={{lg:4,md:3,sm:2}} spacing={4} >
               
               {children_course.map((c)=>(
                 <div className='h-56  bg-gray-200' >
                 <img className='w-full h-3/4 ' src={file_url+c?.image} alt="" />
           
               <center className='h-1/4' >
               <div className='w-full  p-3 text-white bg h-full  ' >
                   <a href={'/course/'+c?._id+"/video/0?parent="+id} className=' w-full' >{c.name}</a>
                 </div>
               </center>
                
                 
               </div>
        
               ))}
          </SimpleGrid>
          </div>
         
         
         
        </div>
        <center>
           <center className='mt-6 bg2 w-3/4 bg-white mx-4 p-4  rounded-lg' >
            <a className='p-4   text-white   text-3xl font-bold' href={"/course/"+id+'/quiz/'+final_exam?._id}>Final Test</a>

       
          </center>

        </center>
       
       </>
      )
    }
    
  return (
    <div>
        <Navbar></Navbar>
        <div className='p-4' >
            <center>
            <h1 className='text-6xl mb-4' >{course?.name}</h1>
            </center>
            <Grid templateColumns={{sm:'2fr',md:"1.4fr 0.6fr"}}gap={6} >
               {children}
                <div className='bg-gray-300' >
                <Accordion defaultIndex={[0,1,2,3,4,5]} allowMultiple>

                {sections?.map((s,i)=>(<div key={i} >
                  
                  <AccordionItem key={i} >
                    <h2>
                      <AccordionButton color={"white"} background={main_color} >
                        <Box as="span" flex='1' textAlign='left'>
                           <div className='flex justify-between' >
                           <h1 className='text-xl text-white font-bold' >{s.name}</h1>
                          
                           </div>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <div>
                            {videos?.map((v,index)=>(
                                <div key={index} >
                                {v.section === s?._id && (<div key={index} className='flex justify-between p-1' >
                                  <a href={'/course/'+id+'/video/'+v?._id} className="ml-2 text-lg p-1" > {v?.name}</a>
                                 
                                </div>)}
                                </div>
                            ))}
                             {quizs?.map((v,index)=>(
                                <div key={index} >
                                {v.section === s?._id && (<div key={index} className='flex justify-between p-1' >
                                  <a href={'/course/'+id+'/quiz/'+v?._id} className="ml-2 text-lg p-1" > {v?.name} (quiz)</a>
                                 
                                </div>)}
                                </div>
                            ))}
                        </div>
                    </AccordionPanel>
                  </AccordionItem>
                   </div>))}
                  <center className='mt-6 bg-white mx-4 px-4 rounded-lg' >
                  <a className='p-4    text-3xl font-bold' href={"/course/"+id+'/quiz/'+final_exam?._id}>Final Test</a>

                  </center>
                  
                  
                </Accordion>
                </div>
             
            </Grid>
         
         
        </div>
        
    </div>
  )
}

export default ShcoolLayout