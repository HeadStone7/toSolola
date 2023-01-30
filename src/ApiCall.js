import axios from "axios";
import store from "./store";
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
    // eslint-disable-next-lin
    async checkCredential(phone, password) {
        if (!phone || !password) {
            return
        } else {
            let found = false
            let resp = await axios
                .get('http://localhost:8080/tosolola/api/contact')
                .catch(err => console.log("Error: ", err));

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

    async register(username, password, phone) {
        if (!phone || !username || !password) {
            console.log('fields empty')
            return
        } else {
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
                    console.error(error)
                })
            return found
        }
    }
}