/* eslint-disable */

import {createStore} from "vuex";

const store = createStore({
    state:{
        user:{
            userId:'',
            username:'',
            phone:'',
            picture:''
        }
    },
    mutations:{
        updateUser(state, payload){
            state.user.userId = payload.contact_id
            state.user.username = payload.username
            state.user.phone = payload.phone
            state.user.picture = payload.profilePhoto
        }
    }
})

export default store