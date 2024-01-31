/* eslint-disable */

import {createStore} from "vuex";
// import axios from "axios";

const store = createStore({
    state:{
        user:{
            userId:'',
            username:'',
            phone:'',
            picture:[],
            city:''
        },
        networkStatus:{
            state: false
        },
        //showIcon image on btn when there's  no image to display
        showIcon: {
            state: false
        }
    },
    mutations:{
        updateUser(state, payload){
            state.user.userId = payload.user_id
            state.user.username = payload.username
            state.user.phone = payload.phone
            state.user.city = payload.city
        },
        /**
         * listening to changes state of network to show/hide loagin/register
         * show/hide loading when login/register
         * @param status
         * @param payload
         */
        networkUpdate(status, payload){
            status.networkStatus.status = payload
        },
        setProfileImage(state, imageData) {
            state.user.picture = imageData
        },
        setDefaultIcon(state, payload){
            state.showIcon.state = payload
        }
    },
    // actions:{
    //     async fetchImage({commit}, userId){
    //         const response = await axios.get(`http://localhost:8080/tosolola/api/get-profile-image?userId=${userId}`, {responseType: "blob"})
    //         const imageData = new Uint8Array(response.data)
    //         commit('setProfileImage', imageData)
    //     }
    // }
})

export default store