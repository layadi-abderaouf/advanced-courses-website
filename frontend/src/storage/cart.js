import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
   cart:[]
  },
  reducers: {
    set_cart : (state,action)=>{
        state.cart = action.payload
        localStorage.setItem('cart',JSON.stringify( action.payload))
    },
   
  
  }
})

export const { set_cart } = cartSlice.actions

//functions
export const getcart = (state) =>{
  if(localStorage.getItem('cart')){
    return  JSON.parse( localStorage.getItem('cart'));
  }
  return state.cart.cart;
}





export default cartSlice.reducer