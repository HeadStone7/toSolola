import axios from "axios";

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

    async getContacts(){
        let resp = await axios
            .get('http://localhost:8080/contacts')
            .catch(err => console.log("Error: ",err));

        console.log(resp.data)

        return resp.data
    }
    // eslint-disable-next-line
    async checkCredential(username, password){
        let resp = await axios
            .get('http://localhost:8080/test')
            .catch(err => console.log("Error: ",err));

        for(let index in resp.data){
            if(resp.data[index].username === username && resp.data[index].pwd === password){
                console.log(username + " Connected")
            }else {
                console.log("Credential error")
            }
        }

        return resp.data
    }

}