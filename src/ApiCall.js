/* eslint-disable */
import axios from "axios";
import store from "./store";

/**
 * ApiCall class
 */
export class ApiCall {

    async getUsers(){
        let resp = await axios
            .get('http://localhost:8080/test')
            .catch(err => console.log("Error: ",err));
        // eslint-disable-next-line
        for(let index in resp.data){
            console.log(resp.data[index].username+";"+resp.data[index].contact_id)

        }

        console.log(resp.data)

        return resp.data
    }

    /**
     * Function Checks credential when login
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
        console.log('post image to db done')

    }

    /**
     * Function gets image from api sent by sendFile
     * and creates a url of the received file and returns it
     * @param userId
     * @returns {Promise<string>}
     */
    async getImageFromAPI(userId){
        let resp = await axios.get('http://localhost:8080/tosolola/api/get-profile-image?userId='+userId, { responseType: 'blob'})
            .catch(error =>{
                store.commit('setDefaultIcon', true)
                console.log('getImageFromAPI error: '+error)
            })
        let url = URL.createObjectURL(resp.data)

        console.log('this image: '+ url)
        return url
    }
}