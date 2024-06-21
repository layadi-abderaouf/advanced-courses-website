import React,{useState,useEffect} from 'react'
import Navbar from '../components/Navbar'
import { Grid,GridItem,Button,Tab,TabList,TabPanel,Tabs,TabIndicator,TabPanels,AccordionItem,AccordionPanel,
    useToast,Tag,Avatar,Box,SimpleGrid,
    TagLabel,Divider,UnorderedList,ListItem,Accordion,AccordionButton,AccordionIcon
 } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { api_url, file_url, main_color } from '../setting'
import { getcart, set_cart } from '../storage/cart'
import { useDispatch, useSelector } from 'react-redux'
import { getuser } from '../storage/user'
import Footer from '../components/Footer'


function CourseDetails() {
    const cart = useSelector(getcart)
    const user = useSelector(getuser)
    const navigate = useNavigate()
    const dispatch = useDispatch() 
    const toast = useToast()
    const {id} = useParams()
    const [children_course, setchildren_course] = useState([])
    const [course, setcourse] = useState({})
    const [is_enroll, setis_enroll] = useState(false)
    const [sections, setsections] = useState([])
    const [videos, setvideos] = useState([])
    const [quizs, setquizs] = useState([])

   useEffect(() => {
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
    axios.get(api_url+'/course?course='+id).then((response)=>{
       
        setcourse(response.data)
        if(user){
          try {
            const config = {
              headers : {
                "content-type":"application/json",
                "Authorization":"Bearer "+user.token, 
              }
            };
          
            axios.post(api_url+'/course/is-enroll',{course_id:id},config).then((res)=>{
              setis_enroll(res.data)
          
            
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
      
    

    if(!user){
      setis_enroll(false)
    }

     
   }, [])

   async function add_to_cart(){
  
    if(!user){
     
      return navigate('/login')
    }
    if(is_enroll){
     
      return navigate('/course/'+course._id+'/video/0')
    }
    if(course.price > 0){
      dispatch(set_cart([...cart,course]))
    }else if(course.price <= 0 && user){

      
      const config = {
        headers : {
          "content-type":"application/json",
          "Authorization":"Bearer "+user.token, 
        }
      };
      await axios.post(api_url+'/course/free-enroll',{course_id:course._id},config).then((response)=>{
        toast({
          title: 'enrollement successfully!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        }) 
        return; 
      }).catch((err)=>{
        console.log(err);
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
    
  }
   
  if(!course?.is_independent){
    return(
        <div>no</div>
    )
  }

  return (
    <div className='bg-gray-100' >
    <Navbar></Navbar>
    <div className=' pb-12'></div>
    <Grid className='p-4' templateColumns={{md:"1fr 1fr",sm:"2fr"}} gap={6}>
     <GridItem  className='bg-white'  >

          <img src={file_url+course?.image} alt="" />
     </GridItem>
     <GridItem >
       <h1 className='font-bold text-5xl w-full mt-1 mb-4' >{course.name}</h1>
       <div className='flex flex-wrap' >
         {course.type === 'diploma' && (
                <Button marginRight={2}  size={3} padding={3}  marginTop={1} colorScheme={"white"} background={'yellow.700'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>

               </Button>
            )}
            <a href={'/teacher/'+course.user_id.teacher_id._id}>
               <Tag padding={2} size={'lg'} colorScheme='green' variant='outline' >
               <Avatar marginRight={2} size={'sm'} src={file_url+course.user_id.teacher_id.image} />
               <TagLabel>{course.user_id.teacher_id?.user_name}</TagLabel>
             </Tag>
            </a>
        
         <h1 className='text-xl text-gray-400 mt-2 ml-2' > . {course.category.name} . 4.5(35)</h1>
       </div>
       <h3 className='text-gray-400 text-xl' >{course.description}</h3>
       <div className='flex justify-between p-2 pr-12 mt-6' >
        <h1 className='font-bold text-2xl' >{course.price === 0 ? 'Free' : course.price + '$'}</h1>
        {is_enroll === true ? (
           <Button onClick={add_to_cart}  padding={4} background={main_color} colorScheme={"white"}  >
            go to shcool

         </Button>
        ):(
              <Button onClick={add_to_cart}  padding={4} background={main_color} colorScheme={"white"}  >

               {course.price === 0 ? 'Enroll now!' : (
                   <div className='flex' >
                       Add to Cart
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                       </svg>
                   </div>
               )}
           
   
             </Button>
        )}
       
       </div>
     </GridItem>
    
    </Grid>
    <Divider></Divider>
    <div className=' p-8 w-full' >
        <Tabs position="relative" variant="unstyled">
    <TabList padding={2} background={"gray.600"} >
      <Tab color={"white"} width={"33%"}>Features</Tab>
      <Tab color={"white"} width={"33%"}>Requirement</Tab>
      <Tab color={"white"} width={"33%"}>Course Content</Tab>
    </TabList>
    <TabIndicator
      mt="-1.5px"
      height="2px"
      bg="white"
      borderRadius="1px"
    />
    <TabPanels>
      <TabPanel>
       <UnorderedList>
       <h1 className='text-xl font-bold p-2 rounded-lg bg text-white m-2' >{(course?.duration /3600).toFixed(1)}Hours of videos in this course</h1> 
       {course.type === "diploma" && (
         <h1 className='text-xl font-bold p-2 rounded-lg bg m-2' >you will get profisional certification after you finish the course</h1> 
       )}
        {course.features.map((f)=>(
            <ListItem key={f} >
               <h1 className='text-xl font-bold p-2 rounded-lg bg2 text-white m-2' >{f}</h1> 
            </ListItem>
        ))}
       </UnorderedList>
       
      </TabPanel>
      <TabPanel>
      <UnorderedList>
        {course.requirement.map((f)=>(
            <ListItem key={f} >
               <h1 className='text-xl font-bold p-2 rounded-lg bg-gray-300 m-2' >{f}</h1> 
            </ListItem>
        ))}
       </UnorderedList>
      </TabPanel>
      <TabPanel>
        {course.type == "diploma" ? (
            <div className='p-12 m-8 bg-gray-200 rounded-lg' >
            <SimpleGrid   columns={{lg:4,md:3,sm:2}} spacing={4} >
                 
                 {children_course.map((c)=>(
                   <div key={c._id} className='h-56  bg-gray-200' >
                   <img className='w-full h-3/4 ' src={file_url+c?.image} alt="" />
             
                 <center className='h-1/4' >
                 <div className='w-full  p-3 text-white bg h-full  ' >
                     <h1  className=' w-full' >{c.name}</h1>
                   </div>
                 </center>
                  
                   
                 </div>
          
                 ))}
            </SimpleGrid>
            </div>
        ):(
          <Accordion defaultIndex={[0]} allowMultiple>

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
                            <h1 className="ml-2 text-lg p-1" > {v?.name}</h1>
                  
                          </div>)}
                          </div>
                      ))}
              {quizs?.map((v,index)=>(
                          <div key={index} >
                          {v.section === s?._id && (<div key={index} className='flex justify-between p-1' >
                            <h1  className="ml-2 text-lg p-1" > {v?.name} (quiz)</h1>
                           
                          </div>)}
                          </div>
                      ))}
                  </div>
              </AccordionPanel>
            </AccordionItem>
             </div>))}
           
   
          </Accordion>
        )}
     
     
      </TabPanel>
     
    </TabPanels>
  </Tabs>
        </div>
   <Footer></Footer>
  </div>
  )
}

export default CourseDetails