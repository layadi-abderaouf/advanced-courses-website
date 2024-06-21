import React,{useState,useEffect} from 'react'
import DLayout from '../../components/Dashboard/DLayout'
import { useSelector } from 'react-redux'
import { getuser } from '../../storage/user'
import { useToast,Button } from '@chakra-ui/react'
import axios from 'axios'
import { api_url } from '../../setting'
import Text from '../../components/Text'
import { useNavigate } from 'react-router-dom'


function DPaymentPage() {
    const user = useSelector(getuser)
    const toast = useToast()
    const navigate = useNavigate()
    const [transactions, settransactions] = useState([])
    const [wallet, setwallet] = useState([0,0,0,0,0]) // 0 => total / 1=>ads / 3=>courses /4=>withdraw /5>tax
    useEffect(() => {
        if(!user){
          return navigate('/login')
        }
        const config = {
            headers : {
              "content-type":"application/json",
              "Authorization":"Bearer "+user?.token, 
            }
          };
      axios.get(api_url+"/course/stat/transactions",config).then((response)=>{
        settransactions(response.data)
        var total = 0;
        var ads = 0;
        var courses = 0;
        var withdraw = 0;
        var tax =0;
        response.data.map((t)=>{
           total += t.value;
           if(t.type === "buy"){
            courses += t.value
           }else if(t.type === "ads"){
            ads += t.value
           }else if(t.type === "withdraw"){
            withdraw += t.value;
           }
           if(user?.email === "admin@admin.com" && t.type === "tax"){
             tax +=t.value
           }
        })
        setwallet([total,ads,courses,withdraw,tax])
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
    
     
    }, [])
    
  return (
    <DLayout>
        <div className='p-4 m-4 bg-gray-300 flex justify-between' >
           <h1 className='text-2xl ' >Available balance : <h1 className='text-3xl font-bold ml-12' >{wallet[0].toFixed(2)}$</h1></h1>
           <button className='btn' >withdraw</button>
        </div>
        <div className='p-4 m-4  flex justify-between' >
            <div className='bg-gray-300 w-1/3 m-2 p-4 py-8' >Total Courses profit : {wallet[2].toFixed(2)}$ </div>
            <div className='bg-gray-300 w-1/3 m-2 p-4 py-8' >Total ADS profit : {wallet[1].toFixed(2)}$</div>
            <div className='bg-gray-300 w-1/3 m-2 p-4 py-8' >Total Withdraw : {wallet[3].toFixed(2)}$</div>
            {user?.email === "admin@admin.com" && (
                <div className='bg-gray-300 w-1/3 m-2 p-4 py-8' >Total tax : {wallet[4].toFixed(2)}$</div>
            )}
            
        </div>
        <div className='m-4 p-4' >
            <h1 className='text-2xl ' >Transactions :</h1>
            <table  className="mt-7 bg-gray-200 basic" >
              <thead>
                <tr>
                 
                  <td className='text-white' ><Text en="type" ar="نوع العملية" ></Text></td>
                  <td className='text-white' ><Text en="value" ar="السعر"/></td>
                  <td className='text-white' ><Text en="date" ar="التاريخ"/></td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t,i)=>(
                  <tr key={i}>
                   
                    <td>{t?.type}</td>
                    <td>{t?.value} $</td>
                    <td>{t?.updatedAt} </td>
                   
            
                   <td>
                    <Button  background={"red"} colorScheme='white' >x</Button>
                   </td>
        
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
    </DLayout>
  )
}

export default DPaymentPage