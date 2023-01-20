import {ApiCall} from '@/ApiCall';

export default {
    components:{

    },
    data () {
      return {
        name: 'chatComponent',
        onclickUser: false,
        user:
        {picture:'Pic',
              name: 'Josh',
              msg:'demain je serai la',
              date:'2020-04-12'
        },
        userActivedId:'',
        userClicked:'',
        container:[
        {picture:'Pic',
              name: 'Josh',
              msg:'demain je serai la',
              date:'2020-04-12'
        },
        {picture:'Pic',
              name: 'Pean',
              msg:'demain je serai la',
              date:'2020-04-12'
        },
        {picture:'Pic',
              name: 'koko',
              msg:'demain je serai la',
              date:'2020-04-12'
        },
        {picture:'Pic',
              name: 'Joshua',
              msg:'demain je serai la',
              date:'2020-04-12'
        },
        {picture:'Pic',
              name: 'Beauty',
              msg:'demain je serai la',
              date:'2020-04-12'
        },
        {picture:'Pic',
              name: 'Akoli',
              msg:'demain je serai la',
              date:'2020-04-12'
        },
        {picture:'Pic',
              name: 'Oko',
              msg:'demain je serai la',
              date:'2020-04-12'
        },
        {picture:'Pic',
              name: 'Peter',
              msg:'demain je serai la',
              date:'2020-04-12'
        },
        {picture:'Pic',
              name: 'Christ',
              msg:'demain je serai la',
              date:'2020-04-12'
        },
        {picture:'Pic',
              name: 'teaf',
              msg:'demain je serai la',
              date:'2020-04-12'
        },
        {picture:'Pic',
              name: 'Pio',
              msg:'demain je serai la',
              date:'2020-04-12'
        },
        {picture:'Pic',
              name: 'Arno',
              msg:'demain je serai la',
              date:'2020-04-12'
        },
        {picture:'Pic',
              name: 'Beni',
              msg:'demain je serai la',
              date:'2020-04-12'
        },

        ]
      }
    },
        beforeMount(){

        },
        mounted() {
            // console.log("updated"+ this.activeUser(true))
            const api = new ApiCall();
            api.checkCredential("Josh", "12345")
                .then()
                .catch()
    },
    methods:{
      getUserId(index){
        this.userActivateId = index
        this.userClicked = this.container[index].name
        this.onclickUser = true
      },
      pushMessage(){
        var textarea = document.getElementById("text-box").value
        if(textarea !== ""){
            // Get the chat messages container element
            var messagesContainer = document.getElementById("messages-box")
            // messageBox.innerHTML +=textarea+"<br>"


            // Create a new div element for the received message
            var receivedMessageDiv = document.createElement("div");
            receivedMessageDiv.className = "message received";
            receivedMessageDiv.style.textAlign = "left";
            // receivedMessageDiv.style.backgroundColor = "#eee";
            receivedMessageDiv.style.marginLeft = "10px";

            // Create a new p element for the message text
            var receivedMessageText = document.createElement("p");
            receivedMessageText.className = "message-text";
            receivedMessageText.textContent = "This is a received message. \n message received";

            // Append the message text to the received message div
            receivedMessageDiv.appendChild(receivedMessageText);

            // Append the received message div to the messages container
            messagesContainer.appendChild(receivedMessageDiv);

            // Create a new div element for the sent message
            var sentMessageDiv = document.createElement("div");
            sentMessageDiv.className = "message sent";
            sentMessageDiv.style.textAlign = "right";
            // sentMessageDiv.style.backgroundColor = "#fff";
            // sentMessageDiv.style.color = "";
            sentMessageDiv.style.marginRight = "10px";

            // Create a new p element for the message text and set textarea's value in p
            var sentMessageText = document.createElement("span");
            sentMessageText.className = "message-text";
            sentMessageText.textContent = textarea;

            // Append the message text to the sent
            sentMessageDiv.appendChild(sentMessageText)
            messagesContainer.appendChild(sentMessageDiv)
                    }
        document.getElementById("text-box").value = ""


      }
    }
}



