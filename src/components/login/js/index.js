/* eslint-disable */
import {ApiCall} from "../../../ApiCall";
import {PahoMqtt} from '../../../PahoMqtt'
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
            showLoading: false,
            mqttClient: null,
            brokerUrl: 'mqtt://localhost:1883'
        }
    },
    watch:{
        showLoading(newVal, oldVal){
            oldVal = this.$store.state.networkStatus.state
        }
    },
    beforeMount() {
        this.api = new ApiCall()
        this.mqttClient = new PahoMqtt({
            hostname: 'localhost',
            port: 9001,
            clientId: 'ove4445ll',
        })
        setTimeout(()=>{
            this.mqttClient.connectToBroker()
        },6000)
        setTimeout(()=>{
            console.log('Subscribing now...')
            this.mqttClient.subscribeToTopic('Test')
        },7000)
        console.log('publishing now..')
        setTimeout(()=>{
            this.mqttClient.publishToBroker('Test', 'This is Tosolola bien again')
            console.log('published')
        },7000)
    },
    mounted() {
        // this.mqttClient.connectBroker('mqtt://localhost:1883')
        // this.mqttClient.subscribe('msg', {qos: 1})
        // this.mqttClient.publish('msg', 'This is message from chatJs on mounted', {qos: 1})

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
            this.$store.commit('networkUpdate',true)

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
                this.$store.commit('networkUpdate',false)
            }, 7000)
        },
        async registerFunc() {
            let registerPhoneInput = document.getElementById("phoneRegisterInput").value
            let registerUsernameInput = document.getElementById("usernameRegisterInput").value
            let registerPassword = document.getElementById("passwordRegisterInput").value
            let registerConfirmPwd = document.getElementById("confirmRegisterInput").value
            this.$store.commit('networkUpdate',true)
            setTimeout(async () => {

                await this.api.register(registerUsernameInput, registerPassword, registerConfirmPwd, registerPhoneInput)
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
                this.$store.commit('networkUpdate',false)
            }, 7000)

        }
    }
}
