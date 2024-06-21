import { Grid,  useToast,Button } from '@chakra-ui/react'
import React,{useState} from 'react'
import Navbar from '../../components/Navbar'
import { api_url } from '../../setting'
import axios from 'axios'
import { login } from '../../storage/user'
import { useDispatch } from 'react-redux'


function RegisterPage() {
    const toast = useToast()
    const dispatch = useDispatch()
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [repetpassword, setrepetpassword] = useState('')
    const [loading, setloading] = useState(false)
    //functions
    async function register(){
        setloading(true)
       if(!password || !repetpassword || !name || !email){
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
       if(password.length < 5){
        toast({
            title: 'password must be longer  !',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          })
          setloading(false)
          return;
       }
       if(password !== repetpassword){
        toast({
            title: 'please rewrite your  password  !',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          })
          setloading(false)
          return;
       }
       try {
        await axios.post(api_url+"/user/register",{name,email,password}).then((response)=>{
            dispatch(login(response.data))
            toast({
                title: "account created successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:'bottom'
              })
              setloading(false)
              return;
        }   
        ).catch((err)=>{
            toast({
                title: err.message,
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
            <div className='bg-gray-200 h-96' ></div>
            <div className='bg-white m-4 rounded-lg p-4' >
               <h1 className='font-bold text-3xl mb-5' >SignUp</h1>
               <input className='mb-2' value={name} onChange={(ev)=>setname(ev.target.value)} type="text" placeholder='enter your name' />
               <input className='mb-2' value={email} onChange={(ev)=>setemail(ev.target.value)} type="email" placeholder='enter your email' />
               <input className='mb-2' value={password} onChange={(ev)=>setpassword(ev.target.value)} type="password" placeholder='enter your password' />
               <input className='mb-2' value={repetpassword} onChange={(ev)=>setrepetpassword(ev.target.value)} type="password" placeholder='repet enter your password' />
               <Button isLoading={loading}  onClick={register} background={"green.600"} colorScheme='white' >register</Button>
            </div>
        
        </Grid>
       
    </center>
    </>
  )
}

export default RegisterPage