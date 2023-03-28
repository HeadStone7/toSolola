/* eslint-disable */
import {ApiCall} from "@/ApiCall";
import {PahoMqtt} from "@/PahoMqtt";

export default {
    components:{

    },
    data () {
      return {
          name: 'chatComponent',
          onclickUser: false,
          showSearchContainerFlag: '',
          messageContainer: null,
          msg:null,
          senderReceiverIdContainer:[],
          userObjectId: null,
          userActivateId: null,
          username:null,
          friendClickedId: null,
          imagePath: undefined,
          api: null,
          mqttClient: null,
          myTopic:null,
          user: {
              picture: 'Pic',
              name: 'Josh',
              msg: 'demain je serai la',
              date: '2020-04-12'
          },
          userActivedId: '',
          userClicked: '',
          friendContainer: []
      }
    },
    beforeMount() {
        this.api = new ApiCall()

    },
    mounted() {
        console.log('After mounted')
        this.messagesContainer = document.getElementById("messages-box")
        this.userObjectId = this.$store.state.user.userId
        this.username = this.$store.state.user.username
        this.mqttConnection()
        this.getAcceptedFriendId()
        this.pushMessage()
        /**
         * The following is displaying the received message in the container of contacts list
         */
        setTimeout(()=>{
            this.mqttClient.setMessageReceivedCallback((senderId, recipientId, receivedMsg) => {
                let senderRecipientId = {
                    senderId: senderId,
                    receiverId: recipientId
                }
                this.senderReceiverIdContainer.push(senderRecipientId)
                this.msg = receivedMsg.payloadString
                console.log(`Finally the received message is: ${this.msg} from: ${senderId} to: ${recipientId}`)
                this.mqttUpdateReceivedMessage(senderId, recipientId, this.msg)
                console.log(`Now pushing received message: ${this.msg}`)
            })
        },1000)
    },
    computed:{
        searchContact() {
            if(this.showSearchContainerFlag === '') return true
            else return false;
        }
    },
    methods: {
        /**
         * Function is connecting to mqtt broker
         */
        mqttConnection(){
            const prefix = this.username
            const randomId = Math.random().toString(36).substring(2, 9)
            this.mqttClient = new PahoMqtt(`${prefix}${randomId}`
            )
            this.myTopic = `${this.username}${this.userObjectId}`
            setTimeout(()=>{
                this.mqttClient.connectToBroker()
                /**
                 * Subscribe to my MQTT topic (username+userid)
                 */
                setTimeout(()=>{
                    this.mqttClient.subscribeToTopic(`friends/chat`)
                    console.log(`Connected to my Topic, subscribe: friends/chat`)
                }, 1000)
            },2000)
        },

        /**
         * 1/ I am getting all the user's friends ids with status of ACCEPTED in DB using
         * getAcceptedFriendsId function
         * 2/I use those ids to get all the users data by id using getUserById function
         * 3/ I use the same userId from the first step to get their picture using
         * getImageFromAPI function
         */
        getAcceptedFriendId(){
            this.api.getAcceptedFriendsId(this.userObjectId)
                .then(id =>{
                    for(let index in id.data){
                        if(id.data[index].user_id === this.userObjectId){
                            continue
                        }

                        this.api.getUserById(id.data[index].user_id)
                            .then(users =>{
                                this.api.getImageFromAPI(id.data[index].user_id)
                                    .then(path =>{
                                        /**
                                         * Fetch each friends data into user object to be displayed on
                                         * user's friends container
                                         * @type {{msg: string, name, userId: *, picture: string}}
                                         */
                                        let friend = {
                                            userId: users[0].user_id,
                                            picture: path,
                                            name: users[0].username,
                                            msg: '',
                                            highlightFlag:false
                                        }
                                        //push user in contact list container
                                        this.friendContainer.push(friend)
                                    })

                            })


                    }
                })
        },
        pushReceivedMsg(){
            for(let index in this.friendContainer){
                for(let index in this.senderReceiverIdContainer){
                    if(this.senderReceiverIdContainer[index].senderId === `${this.friendContainer[index].userId}`
                        && `${this.senderReceiverIdContainer[index].receiverId === `${this.userObjectId}`}`){
                        const receivedMessageDiv = document.createElement("div");
                        const receivedMessageTextP = document.createElement("p");
                        receivedMessageDiv.className = "message-received-div";
                        receivedMessageDiv.style.textAlign = "left";
                        receivedMessageTextP.className = "message-text";

                        receivedMessageTextP.textContent = this.msg
                        receivedMessageDiv.appendChild(receivedMessageTextP)
                        setTimeout(()=>{
                            this.messagesContainer.appendChild(receivedMessageDiv)
                        },10)
                        console.log(`Mqtt received msg pushed`)
                    }

                }
            }

        },
        /**
         * First loop search in friendContainer array.
         * Find the corresponding topic through the userId.
         * Set msg in contact list to new received message
         */
        mqttUpdateReceivedMessage(senderId, receiverId, receivedMsg){
                for (let friend in this.friendContainer) {
                    if(`${this.friendContainer[friend].userId}` === `${senderId}`
                        && `${this.userObjectId}` === `${receiverId}`){
                        this.friendContainer[friend].msg = receivedMsg
                        this.friendContainer[friend].highlightFlag = true
                        break
                    }
                }
        },
        /**
         * Function is used in ChatContactCompo file where the clicked friend's id and the key are taken
         * Also push old messages when a friend is clicked
         * @param index
         * @param friendId
         */
        getClickedUserId(index, friendId) {
            let containerDiv = this.messagesContainer = document.getElementById("messages-box");
            containerDiv.textContent = ''
            this.friendClickedId = friendId
            this.userActivateId = index
            this.userClicked = this.friendContainer[index].name
            this.onclickUser = true

            for(let index in this.senderReceiverIdContainer) {
                if (`${this.senderReceiverIdContainer[index].senderId}` === `${this.friendClickedId}`
                    && `${this.senderReceiverIdContainer[index].receiverId}` === `${this.userObjectId}`) {
                    this.senderReceiverIdContainer.splice(index, 1)
                    for(let index in this.friendContainer){
                        if(`${this.friendContainer[index].userId}` === `${this.friendClickedId}`){
                            this.friendContainer[index].highlightFlag = false
                        }
                    }

                }
            }
            /**
             * The API function is displaying saved history messages from DB to UI of
             * each friends
             */
            this.api.getMsgHistoryFromAPI(this.userObjectId, friendId)
                .then(response =>{
                    for(let index in response.data){
                        // console.log(`msg from data: ${response.data[index].message_txt}`)
                        if (response.data[index].to_contact_id === this.userObjectId && response.data[index].from_contact_id === friendId){
                            // console.log(`Me: ${response.data[index].message_txt}`)

                            /**
                             * THIS IS THE PROCESS OF APPENDING EACH RECEIVED MESSAGES FROM HISTORY TO UI
                             * firstly create DIV (receivedMessageDIV)
                             * secondly create a paragraph P (receivedMessageTextP)
                             * thirdly set a className of receivedMessageDIV to "message-received-div"
                             * and style it
                             * fourthly set a className of receivedMessageTextP to "message-text"
                             * fifthly set receivedMessageTextP content to the received message by
                             * using appendChild
                             * sixthly append Paragraph receivedMessageTextP to DIV receivedMessageDiv by
                             * using appendChild
                             */
                            const receivedMessageDiv = document.createElement("div");
                            const receivedMessageTextP = document.createElement("p");
                            receivedMessageDiv.className = "message-received-div";
                            receivedMessageDiv.style.textAlign = "left";
                            receivedMessageTextP.className = "message-text";


                            receivedMessageTextP.textContent = response.data[index].message_txt

                            // Append the message text to the received message div
                            receivedMessageDiv.appendChild(receivedMessageTextP);

                            // Append the received message div to the messages container
                            this.messagesContainer.appendChild(receivedMessageDiv);


                        }else if(response.data[index].to_contact_id === friendId && response.data[index].from_contact_id === this.userObjectId){
                            // console.log(`${friendId}: ${response.data[index].message_txt}`)

                            const sentMessageDiv = document.createElement("div");
                            sentMessageDiv.className = "message-sent";
                            sentMessageDiv.style.textAlign = "left";

                            const sentMessageText = document.createElement("p");
                            sentMessageText.textContent = response.data[index].message_txt
                            sentMessageDiv.appendChild(sentMessageText)
                            containerDiv.appendChild(sentMessageDiv)
                        }else {
                            console.log(`No message`)
                        }
                    }

                })

            this.pushReceivedMsg()
            //scroll to the bottom to see the last message
            setTimeout(()=>{
                containerDiv.scrollTop = containerDiv.scrollHeight
            },70)

        },
        pushMessage() {
            const textareaContent = document.getElementById("text-box").value
            if (textareaContent !== "") {
                // Get the chat messages container element
                // const messagesContainer = document.getElementById("messages-box")
                // messageBox.innerHTML +=textareaContent+"<br>"
                // Create a new div element for the received message
                // const receivedMessageDiv = document.createElement("div");
                // receivedMessageDiv.className = "message-received-div";
                // receivedMessageDiv.style.textAlign = "left";

                // Create a new p element for the message text
                // const receivedMessageText = document.createElement("p");
                // receivedMessageText.className = "message-text";
                // receivedMessageText.textContent = "This is a received message. This is a received message \n message received";
                //
                // // Append the message text to the received message div
                // receivedMessageDiv.appendChild(receivedMessageText);
                //
                // // Append the received message div to the messages container
                // this.messagesContainer.appendChild(receivedMessageDiv);

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
                sentMessageText.textContent = textareaContent;

                // Append the message text to the sent
                sentMessageDiv.appendChild(sentMessageText)
                setTimeout(()=>{
                    this.messagesContainer.appendChild(sentMessageDiv)
                },250)

                /**
                 * The API is saving sending message
                 * @param this.userObjectId which is userId
                 * @param textareaContent => Text Message
                 * @param this.friendClickedId which is the friend who receives the message
                 */
                this.api.saveMsgToDB(this.userObjectId, textareaContent, this.friendClickedId)
                setTimeout(()=>{
                    this.mqttClient.publishToBroker(`${this.userObjectId}`, `${this.friendClickedId}`, textareaContent)
                    console.log(` From ${this.userObjectId} to : ${this.friendClickedId} message: ${textareaContent}`)
                },4000)


            }
            //Clear text-box
            setTimeout(()=>{
                document.getElementById("text-box").value = ""
            },200)

        },
    }
}



