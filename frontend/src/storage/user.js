import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user : null,
    lang:"EN"
  },
  reducers: {
    login : (state,action)=>{
        state.user = action.payload
        localStorage.setItem('user_info',JSON.stringify( action.payload))
    },
    logout:(state)=>{
      state.user = null
      localStorage.removeItem('user_info')
    },
    set_lang: (state,action)=>{
      state.lang = action.payload
      localStorage.setItem('lang',JSON.stringify( action.payload))
  },
  
  }
})

export const { login,logout,set_lang } = userSlice.actions

//functions
export const getuser = (state) =>{
  if(localStorage.getItem('user_info')){
    return  JSON.parse( localStorage.getItem('user_info'));
  }
  return state.user.user;
}
export const getlang = (state) =>{
  if(localStorage.getItem('lang')){
    return  JSON.parse( localStorage.getItem('lang'));
  }
  return state.user.lang;
}




export default userSlice.reducer