import React,{useEffect,useState} from 'react'
import Navbar from '../components/Navbar'
import { Grid,GridItem,Button, useToast } from '@chakra-ui/react'
import { useSelector ,useDispatch} from 'react-redux'
import { getcart,set_cart } from '../storage/cart'
import { api_url, file_url, main_color } from '../setting'
import { getuser } from '../storage/user'
import { useNavigate } from 'react-router-dom'
import Text from '../components/Text'
import axios from 'axios'


function CartPage() {
    const cart = useSelector(getcart)
    const user = useSelector(getuser)
    const toast = useToast()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [name, setname] = useState('')
    const [country, setcountry] = useState('')
    const [coupon, setcoupon] = useState('')
    const [total_price, settotal_price] = useState(0)


    if(!user || user === null){
        navigate('/login')
    }

    useEffect(() => {
    
        var total = 0;
        cart?.map((p,i)=>{
          total += p?.price;
        })
        settotal_price(total)
      
      }, [cart])
    function delete_product(index){ 
        const newArray = [...cart];
        newArray.splice(index, 1);
        dispatch(set_cart(newArray))   
      }

    async function checkout(){
      try {
        const config = {
          headers : {
            "content-type":"application/json",
            "Authorization":"Bearer "+user.token, 
          }
        };
        var teacher = cart[0].user_id.teacher_id
        cart.forEach(c => {
          if(c.user_id.teacher_id !== teacher){
            toast({
              title: 'you must buy from only one teacher in every payment!',
              status: 'error',
              duration: 5000,
              isClosable: true,
              position:'bottom'
            }) 
            return; 
          }
        });
      
        await axios.post(api_url+'/payment',
        {name,email:user.email,user_id:user._id,teacher_id:cart[0].user_id.teacher_id
        ,cartcourses:cart,total_price},config).then((response)=>{
        
          window.location = response.data
        
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
      
      } catch (error) {
        console.log(error);
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
    if(window.location.href.includes("success")){
     // dispatch(set_cart([]))
      return(
        <div>
          <Navbar></Navbar>
             <center  > 

            <div className=' p-12 w-1/2 rounded-lg mt-12 bg-green-500' >
             <h1 className='text-white text-3xl font-bold'>thanks for your order!</h1>
              <p className='text-xl font-lato text-white' >your payment is success,you can start the course now</p>
            </div>
            </center>
        </div>
      
       
        
      )
      
    }
  return (
    <div className='bg-gray-200 pb-32'>
    <Navbar ></Navbar>
    <center>
    <h1 className=' pb-4 text-5xl font-bold font-lato'>Cart</h1>
    </center>
   
    <Grid className='p-4 pl-8' templateColumns={{sm:'2fr',md:"1.3fr 0.7fr"}}gap={6}>
      <GridItem rounded={"lg"} padding={30} bg='white' >
        {cart?.length > 0 ?
         (<div>
            <table  className="mt-7 bg-gray-200 basic" >
              <thead>
                <tr>
                  <td></td>
                  <td className='text-white' ><Text en="course name" ar="اسم الدورة" ></Text></td>
                  <td className='text-white' ><Text en="price" ar="السعر"/></td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {cart.map((p,i)=>(
                  <tr key={i}>
                    <td>
                        <img style={{maxHeight:125}} className=' md:w-60 sm:w-full rounded-lg' src={file_url+p?.image} alt="" />
                    </td>
                    <td>{p?.name}</td>
                    <td>{p?.price} $</td>
                   
            
                   <td>
                    <Button onClick={()=>delete_product(i)} background={"red"} colorScheme='white' >x</Button>
                   </td>
        
                  </tr>
                ))}
              </tbody>
            </table>
           
         </div>)
         :(<h1>Your Cart is empty</h1>)}
      </GridItem>
      {cart?.length > 0?(
         <GridItem rounded={"lg"} padding={30}  >
         

         
         <h1 className='py-4  font-lato text-3xl' >Order Information</h1>
         <input name="name"  value={name} onChange={ev =>setname(ev.target.value)} type="text" placeholder='Full Name' />
        <input  name="email" value={country} onChange={ev =>setcountry(ev.target.value)} type="text" placeholder='country' />

        <label htmlFor="">coupon code</label>
        <input  name="email" value={coupon} onChange={ev =>setcoupon(ev.target.value)} type="text" placeholder='enter code' />
         
         <div className='p-4 bg-gray-200 mt-5 w-full rounded-lg flex justify-between'>
              <h1 className='text-2xl font-bold' ><Text en="total price" ar="السعر الاجمالي"/> :</h1>
              <h1 className='text-2xl font-bold'>{total_price}$</h1>
            </div>
         <Button onClick={checkout} colorScheme={"white"} background={main_color}><Text en="Continue Payment" ar="المواصلة الى الدفع"/></Button>
         
        </GridItem>
      ):(<div></div>)}
     
     
    </Grid>
</div>
  )
}

export default CartPage