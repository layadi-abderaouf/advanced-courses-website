import React,{useState,useEffect} from 'react'
import Navbar from '../components/Navbar'
import { Grid,Accordion,AccordionButton,Checkbox,AccordionItem,
    AccordionIcon,AccordionPanel,Button,SimpleGrid,Box, useToast
 } from '@chakra-ui/react'
import { api_url, main_color } from '../setting'
import axios from 'axios'
import CourseCard from '../components/CourseCard'
import Text from '../components/Text'
import Footer from '../components/Footer'
import { useSearchParams } from 'react-router-dom'


function CoursePage() {
    const toast = useToast()
    const [searchparams] = useSearchParams()
    const search_q = searchparams.get('search')
    const category = searchparams.get('category')
    const [courses, setcourses] = useState([])
    const [filtredcourses, setfiltredcourses] = useState([])
    const [categories, setcategories] = useState([])
    const [lang, setlang] = useState('all')
    const [diploma_only, setdiploma_only] = useState(false)
    const [orderby, setorderby] = useState(1)
    const [search, setsearch] = useState("")
    const [categories_filter, setcategories_filter] = useState([])
    const [page, setpage] = useState(0)
  

    useEffect(() => {
        axios.get(api_url+'/course/category').then((response)=>{
       
            setcategories(response.data.categories)
            setcategories_filter(new Array(response.data.categories.length).fill(true))
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
    
        if(search_q){
            setsearch(search_q)

        }
    }, [])
    
    useEffect(() => {
        console.log(lang);
        axios.get(api_url+'/course?orderby='+orderby+'&search='+search+'&page='+page+'&lang='+lang+'&only_diploma='+diploma_only).then((response)=>{
       
            setcourses(response.data)
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
    
     
    }, [search,orderby,page,lang])

    useEffect(() => {
       
        let courses_copy = []
        courses.forEach((p)=>{
           
           categories?.map((c,i)=>{
               if(p?.category?._id === c?._id ){

                   if(categories_filter[i] === true){
                     if(diploma_only == false || p.type === "diploma"){
                       
                        if(category){
                            if(category == c?.name){
                               courses_copy.push(p)
                            }
                         }else{
                           courses_copy.push(p)
                         }
                     }
                      
                    
                   }
               }
           })
        })
        
        setfiltredcourses(courses_copy)
       }, [categories_filter,courses,diploma_only])
       
       //functions
       function setCategoryFilter(index,value,isparent,category){
        searchparams.set('category',"")
           let catfil_copy = []
           categories_filter.forEach((c,i)=>{
               if(i === index){
                   catfil_copy.push(value)
                  
               }else{
                   catfil_copy.push(c)
               }
           })
           if(isparent){
               categories?.map((cat,i)=>{
                   if(cat?.parent === category?._id){
                      catfil_copy[i] = value;
                   }
               })
           }
         
   
           setcategories_filter(catfil_copy);
           
       }
    
  return (
    <div>
        <Navbar></Navbar>
        <center className='mt-8' >
            <h1 className='font-bold text-3xl' > <Text en="Discover Our Courses" ar="استكشف دوراتنا" ></Text></h1>
        </center>
        <Grid className='p-4 pl-8' templateColumns={{sm:'2fr',md:"0.5fr 1.5fr"}}gap={6}>
            <div className='bg-gray-100 p-3 rounded-lg' >
                <div className='flex py-3 justify-between' >
                   <h1  className='font-bold text-xl' >Only Premium Course</h1>
                   <Checkbox value={diploma_only}  onChange={(ev)=>setdiploma_only(ev.target.checked)} size={"lg"} colorScheme={"green"} ></Checkbox>
                </div>
                <div className='flex hustify-between py-3' >
                    <h1 className='p-2 mr-2 txt-xl'>Language</h1>
                    <select value={lang} onChange={(ev)=>setlang(ev.target.value)} >
                        <option value="all">all</option>
                        <option value="english">English</option>
                        <option value="Arabic">Arabic</option>
                        
                    </select>
                </div>
                <h1 className='font-bold text-2xl  mb-2' >Categories</h1>
                <Accordion defaultIndex={[0,1,2,3,4,5]} allowMultiple>
                {categories?.map((c,i)=>(<div key={i} >
                    {!c?.parent && (
                  <AccordionItem key={i} >
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                           <div className='flex justify-between' >
                           <h1 className='text-lg font-bold' >{c.name}</h1>
                           <Checkbox value={categories_filter[i]}  onChange={(ev)=>setCategoryFilter(i,ev.target.checked,true,c)} size={"lg"} colorScheme={"green"} defaultChecked></Checkbox>
                           </div>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <div>
                            {categories?.map((cat,index)=>(
                                <div key={index} >
                                {cat?.parent === c._id && (<div key={index} className='flex justify-between p-1' >
                                  <h1 className="ml-2" > {cat?.name}</h1>
                                   <Checkbox  value={categories_filter[i]} onChange={(ev)=>setCategoryFilter(index,ev.target.checked,false,cat)} size={'md'} colorScheme={"green"}  defaultChecked></Checkbox>
                                </div>)}
                                </div>
                            ))}
                        </div>
                    </AccordionPanel>
                  </AccordionItem>
                    )}</div>))}
                  
                </Accordion>
               
            </div>
            <div >
                <div className='bg-gray-100 rounded-lg p-4 w-full mb-4 flex' >
                    <select onChange={(ev)=>setorderby(ev.target.value)}  style={{maxWidth:200}} className='mr-4 mb-0' >
                        <option value="1" key="1">order by date (new - old)</option>
                        <option value="2" key="2">order by date (old - new)</option>
                        <option value="3" key="3">order by price (high - low)</option>
                        <option value="4" key="4">order by price (low - high)</option>
                    </select>
                    <input onChange={(ev)=>setsearch(ev.target.value)} className='mr-1 mb-0' type="text" placeholder='search product' />
                    <Button onClick={()=>setsearch(search)} rounded={"lg"} colorScheme={"white"} background={main_color} >Search</Button>
                </div>
                <div className='bg-gray-200 rounded-lg p-4 w-full '>
                    {filtredcourses.length > 0 ? (
                        <SimpleGrid  columns={1} spacing={4}>
                         { filtredcourses?.map((c)=>(
                             <CourseCard key={c._id} course={c} ></CourseCard>
                         ))}
                       </SimpleGrid>
                    ):(
                       <center className='w-full flex justify-center'>
                       <h1 className='text-lg text-gray-400' >there is no courses</h1>
                       </center>
                    )}
                   
                   
                    <center className='w-full' >
                         <div className='p-4 flex justify-center' >
                            {page > 0 && (
                               <button onClick={()=>setpage(page - 1)} className='btn m-2' > previous </button>
                            )}
                            
                             <button className='btn m-2' >{page + 1}</button>
                             <button onClick={()=>setpage(page + 1)} className='btn m-2' >next</button>
                         </div>
                    </center>
                    

                </div>
            
            </div>
           
        </Grid>
        <Footer></Footer>
    </div>
  )
}

export default CoursePage