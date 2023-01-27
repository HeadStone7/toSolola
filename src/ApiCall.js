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
    // eslint-disable-next-lin
    async checkCredential(username, password) {
        if (username === '' || password === '') {
            return
        } else {
            let found = false
            let resp = await axios
                .get('http://localhost:8080/test')
                .catch(err => console.log("Error: ", err));

            for (let index in resp.data) {
                if (resp.data[index].username === username && resp.data[index].pwd === password) {
                    console.log(username + " Connected")
                    found = true
                } else {
                    console.log(username+" Credential error")

                }
            }

            return found
        }

        // if(username === '' || password === ''){
        //     return;
        // }else {
        //     await axios
        //         .get('http://localhost:8080/test')
        //         .then(response =>{
        //             for(let i = 0; i < response.data.length; i++){
        //                 if(response.data[i].username === username && response.data[i].pwd === password){
        //                     console.log(username+" connected");
        //                     return true
        //                 }
        //             }
        //             return false
        //         })
        //         .catch(err =>{
        //             console.log('Error: '+err)
        //         })
        // }
    }
}