import React, { useEffect, useState } from 'react'
import ShcoolLayout from '../components/ShcoolLayout'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { api_url, file_url } from '../setting'
import { Avatar, useToast } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { getuser } from '../storage/user'
import randomColor from 'randomcolor'


function VideoPge() {
    const user = useSelector(getuser)
    const {video_id,id} = useParams()
    const [video, setvideo] = useState({})
    const [url, seturl] = useState('')
    const [comments, setcomments] = useState([])
    const [refresh, setrefresh] = useState(false)
    const [comment_input, setcomment_input] = useState('')
    const [replys_input, setreplys_input] = useState([])
    const toast = useToast()
    useEffect(() => {
   
      if(video_id !== "0" && video_id){
        axios.get(api_url+'/course/content/video?video_id='+video_id).then((response)=>{
          setvideo(response.data)
          
          seturl(response.data.url + "?user_id="+user._id+"&course_id="+id)
          const config = {
              headers : {
                "content-type":"application/json",
                "Authorization":"Bearer "+user.token, 
              }
          }
          axios.get(file_url+response.data.url+"?course_id="+id+"&user_id="+user._id,config).then((res)=>{
              seturl(res.data)
             
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

      
    }, [])

    useEffect(() => {
      if(video_id !== "0" && video_id ){
        axios.get(api_url+'/course/content/comment?video_id='+video_id).then((res)=>{
          setcomments(res.data)
          setreplys_input(new Array(res.data.length).fill(''))
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
    
    }, [refresh])
    

    async function new_comment(independent = true,comment_id = "",i =0){
     
       if((!comment_input && independent ) || !video_id){
        toast({
          title: 'please write the comment before send it!',
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
          }
        }
        if(independent){
          await axios.post(api_url+"/course/content/comment",{video_id,comment:comment_input},config).then((response)=>{
            setrefresh(!refresh)
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
        }else{
          await axios.post(api_url+"/course/content/comment",{video_id,comment:replys_input[i],type:"reply",comment_id},config).then((response)=>{
            setrefresh(!refresh)
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

    function setreply(value,i){
   
       var array = [...replys_input]
      array[i] = value
      setreplys_input(array)
    }
    if(video_id == "0"){
      return(
        <ShcoolLayout>
          <div className='bg-gray-200 pb-12' ></div>
        </ShcoolLayout>
      )
    }
  return (
    <ShcoolLayout>

    <div className='w-full' >
    <video controls controlsList="nodownload"   height={250} className='w-full' >
          {url && (
            <source src={file_url+url} type="video/mp4" />
          )}      
      </video>
      <h1 className='p-2 text-4xl font-serif ' >{video?.name}</h1>
      <p className='text-gray-400 text-lg p-2' >{video?.description}</p>

      <div>
        <h1 className='my-4 text-xl' >comments and questions :</h1>
        <div className='flex' >
          <textarea value={comment_input} onChange={(ev)=>setcomment_input(ev.target.value)} type="text" placeholder='your comment or question' />
          <button onClick={()=>new_comment()} className='btn ml-2' >send</button>
        </div>
        <div className='mt-4' >
          {comments?.map((c,i)=>(
            <>
            {c.type === "comment" && (
              <div className='p-2' >
                <div className='flex' >
                  <Avatar background={randomColor} color={"white"} size={"sm"} name={c?.user?.name} ></Avatar>
                  <h1 className='text-lg font-bold  ml-2' >{c?.comment}</h1>
                </div>
                <div >
                  {comments.map((com)=>(
                    <>
                    {com.type === "reply" && com?.comment_id == c._id && (
                      <div className='flex ml-8 my-2' >
                         <Avatar background={randomColor} color={"white"} size={"sm"} name={c?.user?.name} ></Avatar>
                        <h1 className='text-lg  ml-2' >{com?.comment}</h1>
                      </div>
                    )}
                    </>
                  ))}
                </div>
                <div className='flex ml-8' >
                   <textarea value={replys_input[i]} onChange={(ev)=>setreply(ev.target.value,i)} type="text" placeholder='reply' />
                   <button onClick={()=>new_comment(false,c._id,i)} className='btn ml-2' >send</button>
                 </div>         
              </div>
            )}
            </>
          ))}
        </div>
      </div>
    </div>
     
       
      
        
      
    </ShcoolLayout>
  )
}

export default VideoPge