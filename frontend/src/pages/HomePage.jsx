import { Button, Grid, SimpleGrid } from '@chakra-ui/react'
import React,{useEffect} from 'react'
import { useSelector ,useDispatch} from 'react-redux'
import { login,getuser } from '../storage/user'
import Navbar from '../components/Navbar'
import { Header } from '../components/Header'
import Footer from '../components/Footer'


function HomePage() {
    const dispatch = useDispatch()
    const data = useSelector(getuser)
    function click(){
        dispatch(login("rooooooooooooooooooooooo"))
    }
     
    
      
    
    
  return (
    <div>
        <Navbar></Navbar>
        <Header></Header>
        <div className='p-4 m-8' >
          <center>
            <h1 className='text-3xl font-serif mt-16 mb-8' >Populare Categories </h1>
            <SimpleGrid  columns={4} spacing={4}>
                      <a href='/courses?category=android' className='rounded-xl p-4 bg-gray-300 h-32' >

                        <center className='mt-1 text-xl' >
                          <img className='w-16 h-16 mb-1' src="/c1.png" alt="" />
                          Web development
                        </center>
                      </a>
                      <div className='rounded-xl p-4 bg-gray-300 h-32' >
                        <center className='mt-8 text-xl' >Web development</center>
                      </div>
                      <div className='rounded-xl p-4 bg-gray-300 h-32' >
                        <center className='mt-8 text-xl' >Web development</center>
                      </div>
                      <div className='rounded-xl p-4 bg-gray-300 h-32' >
                        <center className='mt-8 text-xl' >Web development</center>
                      </div>
                      <div className='rounded-xl p-4 bg-gray-300 h-32' >
                        <center className='mt-8 text-xl' >Web development</center>
                      </div>
                      <div className='rounded-xl p-4 bg-gray-300 h-32' >
                        <center className='mt-8 text-xl' >Web development</center>
                      </div>
                      <div className='rounded-xl p-4 bg-gray-300 h-32' >
                        <center className='mt-8 text-xl' >Web development</center>
                      </div>
                      <div className='rounded-xl p-4 bg-gray-300 h-32' >
                        <center className='mt-8 text-xl' >Web development</center>
                      </div>
            </SimpleGrid>
          </center>
        </div>
        <Footer></Footer>
    </div>
  )
}

export default HomePage