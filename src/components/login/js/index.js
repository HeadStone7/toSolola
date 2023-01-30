/* eslint-disable */
import {ApiCall} from "../../../ApiCall";
export default {
    components: {},
    data() {
        return {
            registerPage: null,
            loginPage: null,
            loginTitleBtn: null,
            registerTitleBtn: null,
            usernameLogin:null,
            api: null,
            showLogin: true,
            showRegister: false,
            showLoading: false
        }
    },
    watch:{
    },
    beforeMount() {
        this.api = new ApiCall()
    },
    mounted() {
        this.registerPage = document.getElementById("registerPage");
        this.loginPage = document.getElementById("loginPage");
        this.loginTitleBtn = document.getElementById("loginState")
        this.registerTitleBtn = document.getElementById("registerState")
    },
    methods: {
        showHideLogin: function () {
            this.showLogin = true
            this.showRegister = false
            this.registerTitleBtn.style.backgroundColor = "";
            this.loginTitleBtn.style.background = "#0e374f85";
        },
        showHideRegister: function () {
            this.showLogin = false
            this.showRegister = true
            this.loginTitleBtn.style.backgroundColor = "#227bb0";
            this.registerTitleBtn.style.backgroundColor = "#0e374f85";
        },
        async loginFunc() {
            let loginPhone = document.getElementById("loginPhoneInput").value;
            let passwordLogin = document.getElementById("loginPasswordInput").value;
            this.showLoading = true

            console.log("loginFunc running ")
            setTimeout(async () => {
                await this.api.checkCredential(loginPhone, passwordLogin)
                    .then(isValid => {
                        console.log('This is isValid = ' + isValid)
                        if (isValid) {
                            this.$emit('loginState', true)
                        } else {
                            console.log(loginPhone + " not connected")
                            this.$emit('loginState', false)
                        }
                    })
                this.showLoading = false
            }, 7000)
        },
        async registerFunc() {
            let registerPhoneInput = document.getElementById("phoneRegisterInput").value
            let registerUsernameInput = document.getElementById("usernameRegisterInput").value
            let registerPassword = document.getElementById("passwordRegisterInput").value
            let registerConfirmPwd = document.getElementById("confirmRegisterInput").value
            this.showLoading = true
            setTimeout(async () => {
                await this.api.checkCredential(registerUsernameInput, registerPassword)
                    .then(async isValid => {
                        if (isValid) {
                            console.log('Account already registered')
                        } else {
                            if (registerPassword !== registerConfirmPwd) {
                                console.log('mot de passe non identique')
                            } else {
                                await this.api.register(registerUsernameInput, registerPassword, registerPhoneInput)
                                    .then(isValid => {
                                        console.log('in register isValid is = ' + isValid)
                                        if (isValid) {
                                            console.log('It\'s valide')
                                            this.showHideLogin()
                                        } else {
                                            console.log('not valide')

                                        }
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                        return false
                                    });
                            }
                        }
                    })
                this.showLoading = false
            }, 7000)

        }
    }
}