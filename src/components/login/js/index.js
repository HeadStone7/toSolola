/* eslint-disable */
import {ApiCall} from "../../../ApiCall";
const registerPage = document.getElementById("registerPage");
const loginPage = document.getElementById("loginPage");
const loginTitleBtn = document.getElementById("loginState")
const registerTitleBtn = document.getElementById("registerState")

export default {
    components: {},
    data() {
        return {}
    },
    beforeMount() {

    },
    mounted() {
    },
    methods: {
        showHideLogin(){
            loginPage.style.display = "flex";
            registerPage.style.display = "none";
            registerTitleBtn.style.backgroundColor = "";
            loginTitleBtn.style.background = "#0e374f85";
        },
        showHideRegister(){
            registerPage.style.display = "flex"
            registerPage.style.alignItems = "start"
            loginPage.style.display = "none"
            loginTitleBtn.style.backgroundColor = "#227bb0";
            registerTitleBtn.style.backgroundColor = "#0e374f85";
        },
        async loginFunc(){
                const api = new ApiCall()

                let usernameLogin = document.getElementById("loginUsernameInput").value;
                let passwordLogin = document.getElementById("loginPasswordInput").value;
                console.log("loginFunc running ")
                await api.checkCredential(usernameLogin, passwordLogin)
                    .then(isValid =>{
                        console.log('This is isValid'+isValid)
                        if(isValid){
                            this.$emit('loginState', true)
                        }else {
                            console.log(usernameLogin +"not connected")
                            this.$emit('loginState', false)
                        }
                    })

        }

    }
}



