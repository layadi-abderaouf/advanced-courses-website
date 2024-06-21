import React,{useState,useEffect} from 'react'
import Navbar from '../components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { getuser, login } from '../storage/user'
import Text from '../components/Text'
import { Tabs,Tab,TabPanel,TabList,TabIndicator,TabPanels,SimpleGrid, useToast } from '@chakra-ui/react'
import { api_url, file_url, main_color } from '../setting'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'


function ProfilePage() {
    const user = useSelector(getuser)
    const navigate = useNavigate()
    const toast = useToast()
    const dispatch = useDispatch()
    const [courses, setcourses] = useState([])
    const [certification, setcertification] = useState([])
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [phone, setphone] = useState('')
    const [old_password, setold_password] = useState('')
    const [new_password, setnew_password] = useState('')
    const [repeat_password, setrepeat_password] = useState('')

   
    useEffect(() => {
      if(!user){
       return navigate('/login')
     }else{
      const config = {
        headers : {
          "content-type":"application/json",
          "Authorization":"Bearer "+user.token, 
    }}
  axios.get(api_url+'/course/enrollemnts',config).then((response)=>{
    setcourses(response.data)
  }).catch((err)=>{
    toast({
        title: 'error',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      }) 
      return; 
  }) 

  axios.get(api_url+'/course/user-certifications',config).then((response)=>{
    setcertification(response.data)
  }).catch((err)=>{
    toast({
        title: 'error',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      }) 
      return; 
  }) 

  setname(user?.name)
  setemail(user?.email)
  setphone(user?.phone || "")
     }

 
     
    
    }, [])
    if(!user){
      return navigate('/login')
    }
    
   async function update_user(){
      if(!name || !email || !user){
        toast({
          title: 'please fill all required fields',
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
        }}
        axios.post(api_url+"/user/update",{name,email,phone},config).then((response)=>{
           dispatch(login(response.data))
         
           toast({
            title: 'user information updated!',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          }) 
          return; 
        }).catch((err)=>{
          toast({
            title: 'error',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          }) 
          return; 
        })
      } catch (error) {
        toast({
          title: 'error',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        }) 
        return; 
      }
   }
   async function change_assword(){
    if(!old_password || !new_password || !repeat_password){
      toast({
        title: 'please fill all required fields',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      }) 
      return; 
    }
    if(new_password !== repeat_password){
      toast({
        title: 'the password do not match',
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
      }}
      axios.post(api_url+"/user/change-password",{old_password,new_password},config).then((response)=>{
        
         toast({
          title: 'password changed successfully!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        }) 
        return; 
      }).catch((err)=>{
        toast({
          title: 'error',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        }) 
        return; 
      })
    } catch (error) {
      toast({
        title: 'error',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      }) 
      return; 
    }
   }

  return (
    <div className=' ' >
        <Navbar></Navbar>
        <center>
            <h1 className='p-4 text-4xl font-bold' >
                <Text en={ "Welcome " + user?.name + " to your Profile "} ar={ "في حسابك" +user?.name+" مرحبا بك   "} ></Text>
            </h1>
        </center>
    <div className='p-4 rounded-lg m-8 bg-gray-200' >
    <Tabs position="relative" variant="unstyled">
    <TabList padding={2} background={main_color} >
      <Tab color={"white"} width={"33%"}>Account</Tab>
      <Tab color={"white"} width={"33%"}>My Courses</Tab>
      <Tab color={"white"} width={"33%"}>My Certification</Tab>
    </TabList>
    <TabIndicator
      mt="-1.5px"
      height="2px"
      bg="white"
      borderRadius="1px"
    />
    <TabPanels>
      <TabPanel>
         <h1 className='text-2xl py-4' >user informations :</h1>

         <label className='ml-4'  htmlFor="">user name</label>
         <input className='mb-1 p-2 ml-4' value={name} onChange={(ev)=>setname(ev.target.value)} type="text" />
         <label className='ml-4'  htmlFor="">email</label>
         <input className='mb-1 p-2 ml-4' value={email} onChange={(ev)=>setemail(ev.target.value)} type="emai"/>
         <label className='ml-4'  htmlFor="">phone number</label>
         <input className='mb-2 p-2 ml-4' value={phone} onChange={(ev)=>setphone(ev.target.value)} type="number" />
         <button onClick={update_user} className='btn ml-4' >Save</button>
         <h1 className='text-2xl py-4 ' >change password :</h1>
         <label className='ml-4'  htmlFor="">old password</label>
         <input className='mb-1 p-2 ml-4' value={old_password} onChange={(ev)=>setold_password(ev.target.value)} type="password" />
         <label className='ml-4'  htmlFor="">new password</label>
         <input className='mb-1 p-2 ml-4' value={new_password} onChange={(ev)=>setnew_password(ev.target.value)} type="password" />
         <label  className='ml-4' htmlFor="">repeat new password</label>
         <input className='mb-2 p-2 ml-4' value={repeat_password} onChange={(ev)=>setrepeat_password(ev.target.value)} type="password"  />
         <button onClick={change_assword} className='btn ml-4' >change password</button>

       
      </TabPanel>
      <TabPanel>
      <center>
                <h1 className=' text-3xl' >my courses</h1>
            </center>

      <div className='p-12 m-4 bg-gray-200 rounded-lg' >
           {courses.length === 0 && (
            <center>
                <h1 className='text-gray-400 text-lg' >you have not participated in any course</h1>
            </center>
           )}
            <SimpleGrid   columns={{lg:4,md:3,sm:2}} spacing={4} >
                 
                 {courses.map((c)=>(
                    <>
                    {c.course.is_independent && (
                         <div key={c._id} className='h-56  bg-gray-200' >
                         <img className='w-full h-3/4 ' src={file_url+c?.course?.image} alt="" />
                   
                       <center className='h-1/4' >
                       <div className='w-full  p-3 text-white bg h-full  ' >
                           <a href={'/course/'+c.course._id}  className=' w-full' >{c.course.name}</a>
                         </div>
                       </center>
                        
                         
                       </div>
                    )}
                 
                 </>
          
                 ))}
            </SimpleGrid>
            </div>
      </TabPanel>
      <TabPanel>
      <center>
                <h1 className=' text-3xl' >my Certifications</h1>
            </center>

      <div className='p-8 mx-4 bg-gray-200 rounded-lg' >
           {certification.length === 0 && (
            <center>
                <h1 className='text-gray-400 text-lg' >you have not obtained  any certificate yet</h1>
            </center>
           )}
            <SimpleGrid   columns={{lg:4,md:3,sm:2}} spacing={4} >
                 
                 {certification.map((c)=>(
                    <>
                    {c.course.is_independent && (
                         <div key={c._id} className='h-56  bg-gray-200' >
                         <img className='w-full h-3/4 ' src={file_url+c?.course?.image} alt="" />
                   
                       <center className='h-1/4' >
                       <div className='w-full  p-3 text-white bg h-full  ' >
                           <a href={'/certification/'+c._id}  className=' w-full' >{c.course.name}</a>
                         </div>
                       </center>
                        
                         
                       </div>
                    )}
                 
                 </>
          
                 ))}
            </SimpleGrid>
            </div>
     
      </TabPanel>
     
    </TabPanels>
    </Tabs>
    </div>
      <Footer></Footer>
    </div>
  )
}

export default ProfilePage