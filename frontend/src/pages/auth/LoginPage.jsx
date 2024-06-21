import { Box, Button, Grid ,useToast} from '@chakra-ui/react'
import React,{useState} from 'react'
import Navbar from '../../components/Navbar'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { api_url } from '../../setting'
import { login } from '../../storage/user'
import { useNavigate} from 'react-router-dom'



function LoginPage() {
    const navigate = useNavigate()
    const toast = useToast()
    const dispatch = useDispatch()
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [loading, setloading] = useState(false)
    //functions
    async function _login(){
        setloading(true)
       if(!password ||  !email){
        toast({
            title: 'Please enter all required field !',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          })
          setloading(false)
          return;
       }
      
       try {
        await axios.post(api_url+"/user/login",{email,password}).then((response)=>{
            console.log(response.data);
            dispatch(login(response.data))
            toast({
                title: "login successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:'bottom'
              })
              setloading(false)
              navigate('/')
              return;
        }   
        ).catch((err)=>{
            toast({
                title: "password or email inccorect",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:'bottom'
              })
              setloading(false)
              return;
        })
       } catch (error) {
        toast({
            title: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          })
          setloading(false)
          return;
       }
    }
  return (
    <>
    <Navbar></Navbar>
    <center className='px-24 py-12' >
        <Grid className=' bg-gray-200 rounded-lg'  templateColumns={{md:"1fr 1fr",sm:"2fr"}} gap={6}>
            <Box  className='bg-gray-200 h-0' ></Box>
            <div className='bg-white m-4 rounded-lg p-4' >
               <h1 className='font-bold text-3xl mb-5' >Login</h1>
               <input className='mb-2' value={email} onChange={(ev)=>setemail(ev.target.value)} type="email" placeholder='enter your email' />
               <input className='mb-2'  value={password} onChange={(ev)=>setpassword(ev.target.value)} type="password" placeholder='enter your password' name="" id="" />
               <Button onClick={_login} isLoading={loading} background={'green.600'} colorScheme='white' >login</Button>
            </div>
        
        </Grid>
       
    </center>
    </>
  )
}

export default LoginPage