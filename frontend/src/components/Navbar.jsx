"use client"
import { Flex, Spacer } from '@chakra-ui/react'
import { useRef } from "react"
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,Button,Avatar
} from '@chakra-ui/react'
import { getlang, getuser ,login, set_lang} from '../storage/user'
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import randomcolor from 'randomcolor'
import { main_color } from '../setting'
import Text from './Text'
import { getcart } from '../storage/cart'


function Navbar() {
  var user = useSelector(getuser)
  const lang = useSelector(getlang)
  const cart = useSelector(getcart)
  const dispatch = useDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  //functions
  function logout(){
    dispatch(login(null))
    user = null;
  }
  function change_lang(){
     if(lang === "EN"){
       dispatch(set_lang('AR'))
     }else{
      dispatch(set_lang('EN'))
     }
  }
 
  
  
  return (
    <div className='pb-16 ' >
    <header className="fixed z-50 w-full flex p-3 bg text-white" >
        <Button display={{base:"flex",md:"none"}} ref={btnRef} background={"green.700"} colorScheme={"white"} onClick={onOpen} className="mt-1 mr-4 " >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
             <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
           </svg>
        </Button>
        <Link className="font-lato  ml-4 text-4xl" to="/" >Champ</Link>
        
        <Flex display={{base:"none",md:"flex"}} className="ml-4  mt-2 w-full gap-2">
          <div  >
           <a className="px-2 m-1 text-xl" href="/courses" > <Text en={'Courses'} ar={'دورات'} /></a>
           <a className="px-2 m-1 text-xl" href="/" > <Text en={'Encyclopedia'} ar={"الموسوعة"} /></a>
           <a className="px-2 m-1 text-xl" href="/" ><Text en={'Blogs'} ar="مقالات" /></a>
          
          
          </div>
          <div className='flex w-1/3'>

            <form className='w-full' action="/courses" method="get">
            <input className='text-green-700'  name='search'  type="text" placeholder='search' />
            </form>
          
          
           </div>
          <Spacer />
          <div className="flex" >
           <Link onClick={change_lang} className='mr-4 mt-1 text-lg' >{lang === "EN" ? "AR" : "EN"}</Link>
           {!user || user == null ?(
            <>
             <Link className="px-3  bg-white  text-green-700 rounded-lg text-xl" to="/login" ><Text en={'login'} ar={"تسجيل الدخول"} /></Link>
             <Link  className="px-2 text-xl" to="/register" ><Text en={'Register'} ar={"تسجيل"} /></Link>
            </>
           ):(
            <div className='mr-3 flex bg' >
              
              <Menu>
               <MenuButton as={Button} >
               <Avatar bg={randomcolor()} color={"white"} size={"sm"} name={user?.name} />
               </MenuButton>
               <MenuList>
               <MenuItem color={"black"} >
                   <Link to={'/profile'} >Profile</Link>
                  </MenuItem>
                  {user.is_teacher ? (
                    <MenuItem color={"black"} >
                    <Link to={'/dashboard/courses'} >teacher dashboard</Link>
                   </MenuItem>
                  ):(
                      <MenuItem color={"black"} >
                      <Link to={'/become-teacher'} >become teacher</Link>
                     </MenuItem>
                  )}
                
                 <MenuItem onClick={logout} color={"black"} >logout</MenuItem>
               
               </MenuList>
             </Menu>
             <a className="px-2 mt-1 text-xl flex" href="/chat" >Messages</a>
            </div>
           )}
           
           <a className="px-2 text-xl mt-1 flex" href="/cart" >Cart
            ({cart.length})</a>
          </div>
        </Flex>
        <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
       
        
      >
        <DrawerOverlay />
        <DrawerContent background={main_color} >
          <DrawerCloseButton color={"white"}  />
          <DrawerHeader>
          <a className="font-lato text-white ml-4 text-4xl" href="/" >Champ</a>
          </DrawerHeader>

          <DrawerBody>
         
          {!user || user == null ?(
            <>
             <Link className="p-2 px-6 ml-3 bg-white  text-green-700 rounded-lg text-xl" to="/login" >login</Link>
             <Link  className="p-2 ml-3  text-white text-xl" to="/register" >register</Link>
             <Link onClick={change_lang} className='mr-4 mt-1 text-white text-lg' >{lang === "EN" ? "AR" : "EN"}</Link>
            </>
           ):(
            <div className='mr-3 bg' >
              
              <Menu>
               <MenuButton as={Button} >
               <Avatar bg={randomcolor()} color={"white"} size={"sm"} name={user?.name} />
               </MenuButton>
               <MenuList>
                 <MenuItem color={"black"} >
                   <Link to={'/profile'} >Profile</Link>
                  </MenuItem>
                  {user.is_teacher ? (
                    <MenuItem color={"black"} >
                    <Link to={'/dashboard/courses'} >teacher dashboard</Link>
                   </MenuItem>
                  ):(
                      <MenuItem color={"black"} >
                      <Link to={'/become-teacher'} >become teacher</Link>
                     </MenuItem>
                  )}
                
                 <MenuItem onClick={logout} color={"black"} >logout</MenuItem>
               
               </MenuList>
             </Menu>
             <Link onClick={change_lang} className='ml-4 text-white text-lg' >{lang === "EN" ? "AR" : "EN"}</Link>
            
            </div>
           )}
           <div className='flex w-full mt-6 ml-3'>
           <input className='text-green-700'  type="text" placeholder='search' />
          
           </div>
            
           <h1 className="ml-3 p-2 text-white m-1 text-2xl"  >
            <a href="/">Courses</a>
            </h1>
            <h1 className="ml-3 p-2 text-white m-1 text-2xl"  >
            <a href="/products">Encyclopedia</a>
            </h1>
            <h1 className="ml-3 p-2 text-white m-1 text-2xl"  >
            <a href="/">Blogs</a>
            </h1>
            <h1 className="ml-3 p-2 text-white m-1 text-2xl"  >
            <a href="/cart">Cart({cart.length})</a>
            </h1>
          
        
          </DrawerBody>

         
        </DrawerContent>
      </Drawer>
      
    </header>
    </div>
  )
}

export default Navbar