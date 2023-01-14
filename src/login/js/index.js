/* eslint-disable */
// import {ApiCall} from "@/ApiCall";

const registerPage = document.getElementById("registerPage");
const loginPage = document.getElementById("loginPage");
const loginTitleBtn = document.getElementById("loginState")
const registerTitleBtn = document.getElementById("registerState")


// export default {
//     components: {},
//     data() {
//         return {}
//     },
//     beforeMount() {
//         const api = require('@/ApiCall');
//
//         let usernameLogin = document.getElementById("loginUsernameInput").value;
//         let passwordLogin = document.getElementById("loginPasswordInput").value;
//
//         api.checkCredentials(usernameLogin, passwordLogin)
//             .then(r => console.log("cool"+r))
//         console.log(usernameLogin + " " + passwordLogin)
//     },
//     methods: {}
// }
function showHideLogin(){
    loginPage.style.display = "flex";
    registerPage.style.display = "none";
    registerTitleBtn.style.backgroundColor = "";
    loginTitleBtn.style.background = "#0e374f85";
}
function showHideRegister(){
    registerPage.style.display = "flex"
    registerPage.style.alignItems = "start"
    loginPage.style.display = "none"
    loginTitleBtn.style.backgroundColor = "#227bb0";
    registerTitleBtn.style.backgroundColor = "#0e374f85";
}
//
// function loginFunction(){
//
// }
