import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { api_url, main_color } from '../../setting'
import DLayout from '../../components/Dashboard/DLayout'
import { getuser } from '../../storage/user'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
//components
import { useToast,Tag,TagLabel
    , Tabs, TabList, TabPanels, Tab, TabPanel,TabIndicator  } from '@chakra-ui/react'
import DCourseContent from '../../components/Dashboard/DCourseContent'
import DCourseSettings from '../../components/Dashboard/DCourseSettings'
import DCourseSta from '../../components/Dashboard/DCourseSta'


function DcourseDetailsPages() {
    const user = useSelector(getuser)
    const [course, setcourse] = useState({})
    const toast = useToast()
    const {id} = useParams()
    useEffect(() => {
        axios.get(api_url+'/course?course='+id).then((response)=>{
         
          setcourse(response.data)
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

      async function deploy(){
        const config = {
          headers : {
            "content-type":"application/json",
            "Authorization":"Bearer "+user.token, 
          }
        };
        try {
          axios.post(api_url+'/course/deploy',{course_id:id},config).then((response)=>{
            toast({
              title: 'course deployed !',
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
        } catch (error) {
           toast({
            title: 'error !!',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          }) 
          return; 
        }
      }
  return (
    <DLayout>
        <div className='flex flex-wrap justify-between p-4 mt-4 bg-gray-500' >
           <h1 className='text-3xl font-bold text-white ' > {course.name}</h1>
           {course.is_independent && (
            <>
  <Tag size={'lg'} variant='solid' background={"white"} marginTop={2} marginRight={2} color={main_color}>
  <TagLabel>type : {course.type}</TagLabel>
  </Tag>
  <Tag size={'lg'} variant='solid' background={"white"} marginTop={2} marginRight={2} color={main_color}>
  <TagLabel>price : {course.price}$</TagLabel>
  </Tag>
 
  <Tag size={'lg'}  variant='solid' background={"white"} marginTop={2} marginRight={2} color={main_color}>
  <TagLabel>category : {course?.category?.name}</TagLabel>
  </Tag>
  </>
           )}
          

            {!course.is_deployed ? (
                <button onClick={deploy} className='p-2 mt-2 bg-white text-green-600 rounded-lg' >Deploy</button>
            ):(
              <button onClick={deploy} className='p-2 mt-2 bg-white text-green-600 rounded-lg' >ReDeploy</button>
            )}
        </div>
        <div className='mt-4 p-2 w-full' >
        <Tabs position="relative" variant="unstyled">
    <TabList padding={2} background={main_color} >
      <Tab color={"white"} width={"33%"}>Settings</Tab>
      <Tab color={"white"} width={"33%"}>Content</Tab>
      <Tab color={"white"} width={"33%"}>Statistiques</Tab>
    </TabList>
    <TabIndicator
      mt="-1.5px"
      height="2px"
      bg="white"
      borderRadius="1px"
    />
    <TabPanels>
      <TabPanel>
        {course?.name && (
           <DCourseSettings course={course} ></DCourseSettings>
        )}
       
      </TabPanel>
      <TabPanel>
        {course?.name && (
           <DCourseContent course={course} ></DCourseContent>
        )}
      
      </TabPanel>
      <TabPanel>
        {course?.name && (
          <DCourseSta course={course} ></DCourseSta>
        )}
        
      </TabPanel>
     
    </TabPanels>
  </Tabs>
        </div>
    </DLayout>
  )
}

export default DcourseDetailsPages