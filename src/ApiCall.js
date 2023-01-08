import axios from "axios";

export class ApiCall {

    async getUsers(){
        let resp = await axios
            .get('http://localhost:8080/home')
            .catch(err => console.log("Error: ",err));

        console.log(resp.data)

        return resp.data
    }

    async getContacts(){
        let resp = await axios
            .get('http://localhost:8080/contact')
            .catch(err => console.log("Error: ",err));

        console.log(resp.data)

        return resp.data
    }

}