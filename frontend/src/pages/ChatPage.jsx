import React,{useState,useEffect} from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { getuser } from '../storage/user'
import axios from 'axios'
import { api_url, file_url, main_color } from '../setting'
import { Avatar, Grid, useToast } from '@chakra-ui/react'
import randomColor from 'randomcolor'

function ChatPage() {
    const user = useSelector(getuser)
    const toast = useToast()
    const [chats, setchats] = useState([])
    const [selected_chat, setselected_chat] = useState({})
    const [messages, setmessages] = useState()
    const [image, setimage] = useState('')
    const [file, setfile] = useState()
    const [refresh, setrefresh] = useState(false)
    const [message, setmessage] = useState('')
    useEffect(() => {
        const config = {
            headers : {
              "content-type":"application/json",
              "Authorization":"Bearer "+user?.token, 
            }
          };
      axios.get(api_url+'/chat',config).then((response)=>{
        setchats(response.data)
       
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

    useEffect(() => {
        const config = {
            headers : {
              "content-type":"application/json",
              "Authorization":"Bearer "+user?.token, 
            }
          };
          if(selected_chat?.name){
            axios.get(api_url+'/chat/messages?chat_id='+selected_chat._id,config).then((response)=>{
                setmessages(response.data)
               
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
          }
     
        console.log(messages);
        console.log(messages);
    }, [selected_chat,refresh])
    

    async function new_message(){
        const config = {
            headers : {
              "content-type":"application/json",
              "Authorization":"Bearer "+user?.token, 
            }
          };
        // e.preventDefault()
         if (!file && !message ){
             toast({
                title: 'there is any message !',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:'bottom'
              })  
           
            return; 
         } 

         if(file){
            try {
                const image = new FormData()
                image.append('file', file)
                await fetch(api_url+'/upload?type=chat_img', {
                 method: 'POST',
                 body: image,
                 headers:{
                     "enctype":"multiparty/form-data",
                     Authorization:'Bearer '+user.token
                 }
               }).then(response => {
                 if (!response.ok) {
                   throw new Error('Network response was not ok');
                 }
                 return response.json();
               })
               .then(async(data) => {
                 // Work with the JSON data here
                 setimage(data.path.slice(7))
                 if(message){
                    await axios.post(api_url+'/chat/message',{message,image:data.path.slice(7),chat_id:selected_chat._id},config).then((res)=>{
                        setmessage('')
                        setrefresh(!refresh)
                    }).catch((err)=>{
                        console.log(err);
                        toast({
                            title: 'error !',
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                            position:'bottom'
                          })  
                       
                        return; 
                    })
                 }
                
                 
               })
              } catch (err) {
                 toast({
                     title: 'error !',
                     status: 'error',
                     duration: 5000,
                     isClosable: true,
                     position:'bottom'
                   })  
                
                 return; 
              }
         }else{
            if(message){
                console.log(message);
                await axios.post(api_url+'/chat/message',{message,chat_id:selected_chat._id},config).then((res)=>{
                   setmessage('')
                   setrefresh(!refresh)
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
             }
         }
     
        
         
         
    }
    
  return (
    <div className='  pb-56' >
        <Navbar></Navbar>
        <Grid templateColumns={{md:"0.6fr 1.4fr",sm:"2fr"}} gap={0} >
            <div className='p-4 my-4 ml-4 bg-gray-200 h-full  rounded-lg' >
                <center>
                <h1 className='text-4xl mb-4' >Chat List</h1>
                </center>
               
                {chats?.map((c)=>(
                    <button onClick={()=>setselected_chat(c)} className='bg2 text-white p-4 w-full mb-2 flex justify-between rounded-lg'  key={c._id} >
                        <Avatar background={randomColor} color={'white'} size={"md"} name={c.name} ></Avatar>
                        <h1 className='mt-2 ml-2' >{c?.name} {c.is_group  && "(Group)"}</h1>
                        
                    </button>
                ))}
            </div>
            <div className='bg-gray-300 m-4 h-full rounded-lg' >
                {messages ? (<div className='flex flex-col justify-between' >
                    <div className='p-4 bg2 mx-4 my-2 text-white rounded-lg ' >
                        <h1 className='text-xl ' >{selected_chat.name}</h1>
                    </div>
                    <div className=' flex w-full p-4 fixed bottom-0 left-0 z-50  rounded-lg ' >
                         <input value={message} onChange={(ev)=>setmessage(ev.target.value)} className='w-3/4 border-solid border-2 border-green-600' placeholder='new message' type="text" />
                         <button onClick={new_message} className='btn mx-1 flex-1' >send</button>
                        
                         <div className=" flex-1 " >
                   
                              <label className="shadow bg text-white w-full rounded-lg border   flex items-center p-1" >
                                  <center className='w-full' >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1 ">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                  </svg>
                                  Upload
                                 <input type="file" name="file" onChange={(e) => setfile(e.target.files[0])} className="hidden" />
                                  </center>
                      
                              </label>
                          </div>
                    </div>
                    <div  className='p-4 m-4 rounded-lg min-h-56 bg-white' >
                        {messages.map((m)=>(<>
                            {m.user?._id == user?._id ?(
                                <>
                                  <div className='flex justify-end' >
                                  <div className=' rounded-full flex rtl mb-1 ' >
                                      <h1 className='mt-1 ml-2  p-1 text-right' >{m?.message}</h1> 
                                      <Avatar margin={1} size={"sm"}  background={main_color}  name={m?.user?.name} ></Avatar>
                                      
                                     
                                      </div>
                                      
                              </div>
                              {m?.image && (
                                <center>
                                      <img className='ml-24 w-3/4' src={file_url+m.image} alt="" />
                                </center>
                                      
                                      )}
                              </>
                            ) :(     <>
                                <div className='flex flex-start' >
                                <div className='flex rounded-full ' >
                                  
                                    <Avatar margin={1} color={'white'} size={"sm"} background={randomColor} name={m?.user?.name} ></Avatar>
                                    <h1 className='mt-1 ml-2  p-1' >{m.message}</h1> 
                                    </div>
                              </div>
                                {m?.image && (
                                  <center>
                                        <img className='mr-24 w-3/4' src={file_url+m.image} alt="" />
                                  </center>
                                        
                                        )}
                                        </>

                            )}
                      
                        </>))}
                    </div>
                    
                </div>):(
                    <center>
                        <h1 className='text-xl text-gray-500 mt-24' >Start Messaging now!</h1>
                    </center>
                )}
            </div>
        </Grid>
    </div>
  )
}

export default ChatPage