/* eslint-disable */
import axios from "axios";
import store from "./store";

/**
 * ApiCall class
 */
export class ApiCall {

    async checkFriendshipStatus(username, userId){
        const response = await axios.get(`http://localhost:8080/tosolola/api/check-status?username=${username}&userId=${userId}`)
            .catch(error =>{
                console.error(`checkFriendshipStatus: ${error}`)
            })
        return response
    }

    /**
     * Return all registered users
     * @returns {Promise<any>}
     */
    async getAllUsers(){
        const response = await axios.get('http://localhost:8080/tosolola/api/users')
            .catch(error =>{
                console.log('getUsers Error: '+error)
            })

        // console.log(response.data)
        return response.data
    }

    /**
     * Function Checks credential when login,
     * also used to check before registering
     * @param phone
     * @param password
     * @returns {Promise<boolean>}
     */
    async checkCredential(phone, password) {
        if (!phone || !password) {
            return false
        } else {
            let found = false
            let resp = await axios
                .get('http://localhost:8080/tosolola/api/users')
                .catch(err => {
                    store.commit('networkUpdate', false)
                    console.log("Error: ", err)
                });

            for (let index in resp.data) {
                if (resp.data[index].phone === phone && resp.data[index].pwd === password) {
                    console.log(resp.data[index].username + " Connected")
                    store.commit('updateUser', resp.data[index])
                    found = true
                } else {
                    console.log(resp.data[index].username+" Credential error")

                }
            }

            return found
        }

    }

    /**
     * Function add new user to the DB
     * @param username
     * @param password
     * @param phone
     * @returns {Promise<boolean>}
     */
    async register(username, password, confirmPassword, phone) {
        if (!phone || !username || !password || !confirmPassword) {
            console.log('fields empty')
            return false
        }else if (password !== confirmPassword){
            console.log('mot de passe non identique')
        }else if(await this.checkCredential(phone, password)){
            console.log('Account already registered')
        } else{
            let found = false
            await axios.post('http://localhost:8080/tosolola/api/register', {
                username: username,
                pwd: password,
                phone: phone
            })
                .then(isValid => {
                    console.log('is valid =' + isValid.data)
                    found = !!isValid.data;
                })
                .catch(error => {
                    store.commit('networkUpdate', false)
                    console.error(error)
                })
            return found
        }
    }

    /**
     *Function Posts Image and userId
     * @param image
     * @param userId
     * @returns {Promise<void>}
     */
    async postImageToDB(image, userId){
        console.log(userId + ' I am not empty')
        await axios.post('http://localhost:8080/tosolola/api/upload-profile?id='+userId, image)
            .then(response => response.status)
            .then(data =>{
                console.log('Success', data)
            })
            .catch(error =>{
                console.error('Error: '+error)
            })

    }

    /**
     * Function gets image from api sent by sendFile
     * and creates a url of the received file and returns it
     * @param userId
     * @returns {Promise<string>}
     */
    async getImageFromAPI(userId){
        try {
            let resp = await axios.get('http://localhost:8080/tosolola/api/get-profile-image?userId='+userId, { responseType: 'blob'})
                .catch(error =>{
                    store.commit('setDefaultIcon', true)
                    console.log('getImageFromAPI error: '+error)
                })
            let url = URL.createObjectURL(resp.data)

            console.log('this image: '+ url)
            return url;
        }catch (e) {
            console.log(`getImageFromAPI: `+e)
        }
    }

    /**
     * Function is getting ids of friends with status of "Accepted"
     * @param userId
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    async getAcceptedFriendsId(userId){
        let response = await axios.get('http://localhost:8080/tosolola/api/accepted-friends-id?userId='+userId)
            .catch(error =>{
                console.log('getIds error: '+error)
            })
        return response;
    }

    /**
     * Functions is getting any user data by Id
     * @param userId
     * @returns {Promise<*>}
     */
    async getUserById(userId){
        let response = await axios.get('http://localhost:8080/tosolola/api/user-contacts-list?userId='+userId)
            .catch(error =>{
                console.log(`getUserById error: ${error}`)
            })
        // console.log(` getUserById: ${response}`)

        return response.data;
    }

    /**
     * Function get message from API by id
     * @param userId
     * @param friendId
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    async getMsgHistoryFromAPI(userId, friendId) {
        try {
            const response = await axios.get(
                'http://localhost:8080/tosolola/api/msg-history?userId=' +
                userId +'&friendId='+ friendId
            );
            // console.log(`this is getMsgHistory ${response.data[0].message_txt}`);
            return response;
        } catch (error) {
            console.log(`getMsgHistoryFromAPI error: ${error}`);
        }
    }
    async saveMsgToDB(fromContactId, msg, toContactId){
        try {
            await axios.get(
                'http://localhost:8080/tosolola/api/save-msg?fromContactId='+fromContactId+'&msg='+
                msg+'&toContactId='+toContactId)
                .catch(error =>{
                    console.log(`saveMsgToDB error: ${error}`)
                })
            console.log('msg saved in DB')
        }catch (e) {
            console.log(`saveMsgToDB: ${e}`)
        }
    }

}