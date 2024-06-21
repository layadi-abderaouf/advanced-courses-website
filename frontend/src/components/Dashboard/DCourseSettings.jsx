import React,{useState,useEffect} from 'react'
import { api_url, file_url, main_color } from '../../setting'
import axios from 'axios'
import { Popover,PopoverBody,PopoverContent,  Tag,
  TagLabel,TagCloseButton,
    PopoverCloseButton,PopoverTrigger,Button,useToast } from '@chakra-ui/react'
import { getuser } from '../../storage/user'
import { useSelector } from 'react-redux'



function DCourseSettings({course}) {
  
    const toast = useToast()
    const user = useSelector(getuser)
    const [name, setname] = useState('')
    const [categories, setcategories] = useState([])
    const [loading, setloading] = useState(false)
    const [description, setdescription] = useState('')
    const [price, setprice] = useState(0)
    const [category, setcategory] = useState('65883eff3b88f4386a6c6cdb')
    const [language, setlanguage] = useState('')
    const [image, setimage] = useState('https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg')
    const [features, setfeatures] = useState([])
    const [requirement, setrequirement] = useState([])
    const [requirement_input, setrequirement_input] = useState('')
    const [features_input, setfeatures_input] = useState('')
    const [file, setfile] = useState()
    useEffect(() => {

       
      setname(course.name)
      setdescription(course.description)
      setcategory(course.category?._id)
      setprice(course.price)
      setimage(course.image)
      setfeatures(course.features)
      setrequirement(course.requirement)
      setlanguage(course?.language)

      axios.get(api_url+'/course/category').then((response)=>{
       
        setcategories(response.data.categories)
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
        if(file){
            uploadImages()
        } 
      }, [file])
    
    //function
    function remove_item(array,item){
        if(array === 'r'){
          var new_array = [...requirement]
          const filtred_array = new_array.filter((_item)=>_item !== item)
          setrequirement(filtred_array)
        }else if(array === 'f'){
          var new_array2 = [...features]
          const filtred_array2 = new_array2.filter(i=>i !== item)
          setfeatures(filtred_array2)
        }
         
      }

      async function uploadImages(){
        setloading(true)
        // e.preventDefault()
         if (!file){
             toast({
                title: 'error there is any file !',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:'bottom'
              })  
            setloading(false)
            return; 
         } 
     
         try {
           const image = new FormData()
           image.append('file', file)
           await fetch(api_url+'/upload?type=course_img', {
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
          .then(data => {
            // Work with the JSON data here
            setimage(data.path.slice(7))
            setloading(false)
            
          })
         } catch (err) {
            toast({
                title: 'error !',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:'bottom'
              })  
            setloading(false)
            return; 
         }
         
         
    }
    async function update_course(){
      
        setloading(true)
        var _price = 0;
       if(!name ){
        toast({
            title: 'error enter all required field !',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          }) 
         
        setloading(false)
        return; 
       }
       if(price){

        _price = price
       }
     
       try {
        const config = {
            headers : {
              "content-type":"application/json",
              "Authorization":"Bearer "+user.token, 
            }
          };
         var data = {}
         if(course.is_independent){
          data = {
            course_id:course._id,name,description,price:_price,category,language,
            features,requirement,image
          }
         }else{
          data = {
            course_id:course._id,name,description,price:1,
           image
        }
         }
        await axios.patch(api_url+"/course/",data,config).then(()=>{
            toast({
                title: ' course updated successfully!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:'bottom'
              })  
            setloading(false)
            return; 
        }).catch((err)=>{
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
            title: 'error!',
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
    <div>
         <label >course name</label>
        <input  value={name} onChange={(ev)=>setname(ev.target.value)} placeholder='name' type="text" />
        <label >description</label>
        <textarea placeholder='description' value={description}   onChange={(ev)=>setdescription(ev.target.value)}   cols="5" rows="5"></textarea>
        {course.is_independent && (
          <>
           <label >course price</label>
           <input min={0} value={price} onChange={(ev)=>setprice(ev.target.value)}  type="number" />
           <label >category</label>
           <select value={category} onChange={(ev)=>setcategory(ev.target.value)} name="" id="">
              {categories?.map((c)=>(
               <option value={c?._id} key={c?._id}>{c?.name}</option>
              ))}
           </select>
          
           <label >course languege </label>
           <select value={language} onChange={(ev)=>setlanguage(ev.target.value)} name="" id="">
               <option value="arabic">arabic</option>
               <option value="english">english</option>
           </select>
           </>
        )}
       
       
       
        <div className="mb-5 mt-1 " >
                    <label >course img</label>
                    <div className='flex' >
                        <img className='w-1/3 mr-4 p-1  h-24' src={file_url+image} alt="" />
                    <label className="shadow bg-gray-200 w-full  rounded-lg border h-24  flex items-center p-1" >
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
                {course.is_independent && (
                  <>
                    <div className='flex'>
        <label className='mr-4 my-1'>features</label>
        <Popover>
            <PopoverTrigger>
                <button className='h-1/2 mt-1 px-1 rounded-full bg-gray-200 ' >?</button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverCloseButton/>
                <PopoverBody>
                    course features like 
                </PopoverBody>
            </PopoverContent>
        </Popover>
        </div>
        <div className='flex flex-wrap' >
        {features?.map(f=>(
            <Tag size={'lg'} key={f} variant='outline' marginTop={2} marginRight={2} color={main_color}>
            <TagLabel>{f}</TagLabel>
            <TagCloseButton onClick={()=>remove_item('f',f)} /> 
           </Tag>
        ))}
        <input value={features_input} onChange={(ev)=>setfeatures_input(ev.target.value)} className=' mt-2 w-1/4' type="text" />
        <button onClick={()=>setfeatures([...features,features_input])} className='bg p-2 mt-2 rounded-lg ml-2 text-white' >add</button>
         
        </div>
        <div className='flex'>
        <label className='mr-4 my-1'>requirement</label>
        <Popover>
            <PopoverTrigger>
                <button className='h-1/2 mt-1 px-1 rounded-full bg-gray-200 ' >?</button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverCloseButton/>
                <PopoverBody>
                    course features like 
                </PopoverBody>
            </PopoverContent>
        </Popover>
        </div>
        <div className='flex flex-wrap' >
        {requirement?.map(f=>(
            <Tag size={'lg'} key={f} variant='outline' marginTop={2} marginRight={2} color={main_color}>
            <TagLabel>{f}</TagLabel>
            <TagCloseButton onClick={()=>remove_item('r',f)} /> 
           </Tag>
        ))}
        <input value={requirement_input} onChange={(ev)=>setrequirement_input(ev.target.value)} className=' mt-2 w-1/4' type="text" />
        <button onClick={()=>setrequirement([...requirement,requirement_input])} className='bg p-2 mt-2 rounded-lg ml-2 text-white' >add</button>
         
        </div>
                  </>
                )}
       
    
       <center>
       <Button onClick={update_course} marginTop={8}  isLoading={loading} colorScheme='white' background={main_color} className='btn w-full' >save</Button>
       </center>
    </div>
  )
}

export default DCourseSettings