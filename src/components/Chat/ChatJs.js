/* eslint-disable */
import {ApiCall} from "@/ApiCall";
export default {
    components:{

    },
    data () {
      return {
          name: 'chatComponent',
          onclickUser: false,
          showSearchedUser: false,
          messageContainer: null,
          userObjectId: null,
          api: null,
          user: {
              picture: 'Pic',
              name: 'Josh',
              msg: 'demain je serai la',
              date: '2020-04-12'
          },
          userActivedId: '',
          userClicked: '',
          container: []
      }
    },
    beforeMount() {
        this.api = new ApiCall()

    },
    mounted() {
        // this.api.getAllUsers()
        //     .then(data =>{
        //         for(let index in data){
        //             console.log('data: '+data[index].username)
        //         }
        //     })
        this.messagesContainer = document.getElementById("messages-box")
        this.userObjectId = this.$store.state.user.userId
        /**
         * 1/ I am getting all the user's friends ids with status of ACCEPTED in DB using
         * getAcceptedFriendsId function
         * 2/I use those ids to get all the users data by id using getUserById function
         * 3/ I use the same userId from the first step to get their picture using
         * getImageFromAPI function
         */
        this.api.getAcceptedFriendsId(this.userObjectId)
            .then(id =>{
                for(let index in id.data){
                    if(id.data[index].user_id === this.userObjectId){
                        continue
                    }

                    this.api.getUserById(id.data[index].user_id)
                        .then(users =>{
                            // console.log(`users : ${users[0].username}`)

                            this.api.getImageFromAPI(id.data[index].user_id)
                                .then(path =>{
                                    let user = {
                                        picture: path,
                                        name: users[0].username,
                                        msg: 'demain je serai la lolo cool love purity',
                                        date: '2020-04-12'
                                    }
                                    this.container.push(user)
                                })

                        })
                    // console.log(`userId = '${this.$store.state.user.userId} and friendId = '${id.data[index].user_id}' `)
                    this.api.getMsgHistoryFromAPI(this.userObjectId, id.data[index].user_id)
                        .then(response =>{
                            for(let index in response.data){
                                // console.log(`msg from data: ${response.data[index].message_txt}`)
                                if (response.data[index].from_contact_id === this.userObjectId){
                                    console.log(`Me: ${response.data[index].message_txt}`)
                                }else{
                                    console.log(`Friend: ${response.data[index].message_txt}`)
                                }
                            }

                        })
                }
            })



    },
    methods: {
        getUserId(index) {
            this.userActivateId = index
            this.userClicked = this.container[index].name
            this.onclickUser = true
        },
        pushMessage() {
            const textarea = document.getElementById("text-box").value
            if (textarea !== "") {
                // Get the chat messages container element
                // const messagesContainer = document.getElementById("messages-box")
                // messageBox.innerHTML +=textarea+"<br>"
                // Create a new div element for the received message
                const receivedMessageDiv = document.createElement("div");
                receivedMessageDiv.className = "message-received-div";
                receivedMessageDiv.style.textAlign = "left";

                // Create a new p element for the message text
                const receivedMessageText = document.createElement("p");
                receivedMessageText.className = "message-text";
                receivedMessageText.textContent = "This is a received message. This is a received message \n message received";

                // Append the message text to the received message div
                receivedMessageDiv.appendChild(receivedMessageText);

                // Append the received message div to the messages container
                this.messagesContainer.appendChild(receivedMessageDiv);

                // Create a new div element for the sent message
                const sentMessageDiv = document.createElement("div");
                sentMessageDiv.className = "message-sent";
                sentMessageDiv.style.textAlign = "left";
                // sentMessageDiv.style.float = "right";
                // sentMessageDiv.style.width = "100%";
                // sentMessageDiv.style.marginRight = '10px'
                // sentMessageDiv.style.marginBottom = '15px'


                // sentMessageDiv.style.width = "200px";
                // sentMessageDiv.style.backgroundColor = "#fff";
                // sentMessageDiv.style.color = "";
                // sentMessageDiv.style.marginRight = "10px";

                // Create a new p element for the message text and set text-area's value in p
                const sentMessageText = document.createElement("p");
                // sentMessageText.style.height= 'fit-content'
                // sentMessageText.style.textAlign = 'right'
                // sentMessageText.style.width = '200px'
                // sentMessageText.style.overflowWrap = 'auto'
                // sentMessageText.className = "message-text";
                sentMessageText.textContent = textarea;

                // Append the message text to the sent
                sentMessageDiv.appendChild(sentMessageText)
                this.messagesContainer.appendChild(sentMessageDiv)

                //Keep scrollbar down after receiving message
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight

            }
            document.getElementById("text-box").value = ""
        },
        searchContact:()=>{
            let searchingString = document.getElementById('searchField').value
            if(searchingString !== ''){

            }
        }
    }
}



