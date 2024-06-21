import {configureStore} from '@reduxjs/toolkit'

import user from './storage/user'
import cart from './storage/cart'

export const store = configureStore({
    reducer: {
        user:user,
        cart:cart
    }
})