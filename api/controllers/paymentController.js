const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const Enrollement = require('../models/course_content/Enrollement');
const Chat = require('../models/ChatModel');
const stripe = require('stripe')("");



const checkout = asyncHandler(
    async(req,res)=>{
        const {
            user_id,country,email,cartcourses,total_price,teacher_id
        } = req.body
        if(!user_id || !email || !cartcourses || !total_price){
            res.status(404).json('not found')
        }
        let line_items = []
        let courses_id = []
        for (let index = 0; index < cartcourses?.length; index++) {
            line_items.push({
                quantity:1,
                price_data:{
                    currency:'USD',
                    product_data:{name:cartcourses[index].name},
                    unit_amount:100* cartcourses[index].price
                }
            })
            courses_id.push(cartcourses[index]._id)
            
        }
        try {
            const order = await Transaction.create({
                line_items,user_id:teacher_id,type:"buy"
               ,value:total_price,status:false})
    
            const seasion = await stripe?.checkout.sessions.create({
                line_items,
                mode:'payment',
                customer_email:email,
                success_url:'http://localhost:3000/cart?success=1',
                cancel_url:'http://localhost:3000/cart?cancel=1',
                metadata:{transactionID:order._id.toString(),courses_id:JSON.stringify(courses_id),total:total_price,user_id}
    
            })
            res.status(200).json(seasion.url)
    
        } catch (error) {
            res.status(500).json(error)
        }
    }
)

const webhook = asyncHandler(
    async(req,res)=>{
        let event;
        const endpointSecret = "whsec_3d691af875b78f6158fdfdabdf0d08a3d108860aa3d7cb39eeb2f281e0404d3d";
      
        try {
          //const body = await request.text();
          //const sig = headers().get("Stripe-Signature") ?? "";
          const sig = req.headers["stripe-signature"]
          
          //const stripePayload = (req as any).rawBody || req.body;
          event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
         
          res.status(505).json(err)
          
        }
       
      
        // Handle the event
        switch (event.type) {
          case 'checkout.session.completed':
            const data = event.data.object;
            const orderid= data.metadata.transactionID;
            const courses_id = JSON.parse( data.metadata.courses_id)
            const total_price = data.metadata.total
            const user_id = data.metadata.user_id
            if( data.payment_status == 'paid'){
                
                const seller_revenu = total_price - (total_price * 0.2)
                const tax = total_price - seller_revenu;
                await Transaction.create({user_id:process.env.ADMIN,value:tax,type:"tax",status:true})
              const tansaction = await Transaction.findByIdAndUpdate(orderid,{status:true,value:seller_revenu});

              if(tansaction){
                 courses_id?.map(async(c)=>{
                    await Enrollement.create({user:user_id,course:c})
                    var chat= await Chat.findOne({course:c})
                    if(chat){
                       chat.members?.push(req.user._id)
                        await chat.save();
                        res.status(201).json(enroll)
                    }
              })
              

              res.status(201).json('ok')
                
            }else{
                res.status(200).json('error')
              }
            }
            break;
         
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
      
        // Return a 200 response to acknowledge receipt of the event
        res.status(200).json('error')
    }
)

module.exports = {checkout,webhook}