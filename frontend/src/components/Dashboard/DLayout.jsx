import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getuser } from '../../storage/user'
//components
import DSidebar from './DSideBar'
import { Menu, useToast,Button,MenuList,
    Avatar,MenuButton,MenuItem }
     from '@chakra-ui/react'
import randomcolor from 'randomcolor'





export default function DLayout({children}) {
    const user = useSelector(getuser)
    const toast = useToast()
    const [shownav, setshownav] = useState(false)
 
  
  if(!user || user == null || !user?.is_teacher){
    return toast({
        title: 'you are not login !',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      })   
   }
  function st(){
    
    setshownav(!shownav)
    
  }
  return (
   
    <div className='bg  min-h-screen'>
     
      <div className={' flex '} >
        <DSidebar change={st} show={shownav} />
       
      <div className='bg-white flex-grow  ' >
    
      <div className='w-full flex justify-between bg2 p-2 pr-4' >
      
              <button className='text-white' onClick={st} >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                </svg>
              </button>
         <div className='flex justify-end' >
            <a href='/'  className='text-white mx-4 mt-2' >message</a>
            <a  href='/' className='text-white mx-4 mt-2' >notification</a>

            <Menu>
               <MenuButton as={Button} >
               <Avatar bg={randomcolor()} color={"white"} size={"sm"} name={user?.name} />
               </MenuButton>
               <MenuList>
                 <MenuItem color={"black"} >Account</MenuItem>
                 <MenuItem color={"black"} >become teacher</MenuItem>
                 <MenuItem  color={"black"} >logout</MenuItem>
               
               </MenuList>
            </Menu>
            </div>
           
      </div>
      <div className=' mb-3 p-4 ' >
      {children}
      </div>
       
      </div> 
     </div>
    </div>
    
   
  )
}
