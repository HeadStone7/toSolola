/* eslint-disable */
import {ApiCall} from "@/ApiCall";
import {PahoMqtt} from "@/PahoMqtt";
import contact from "@/views/contacts/contact.vue";
import {createTextVNode} from "vue";

export default {
    components: {},
    data() {
        return {
            name: 'chatComponent',
            onclickUser: false,
            msg: null,
            senderReceiverIdContainer: [],
            userObjectId: null,
            userActivateId: null,
            username: null,
            friendClickedId: null,
            imagePath: undefined,
            api: null,
            mqttClient: null,
            userClicked: '',
            friendContainer: [],
            smsAudio: null,
            addSearchFlag: false
        }
    },
    beforeMount() {
        this.api = new ApiCall()
    },
    mounted() {
        console.log('After mounted')
        this.smsAudio = new Audio(process.env.BASE_URL + 'smsNotification.mp3')
        this.messagesContainer = document.getElementById("messages-box")
        this.userObjectId = this.$store.state.user.userId
        this.username = this.$store.state.user.username
        this.mqttConnection()
        this.getAcceptedFriendId()
        this.pushMessage()
        /**
         * The following is displaying the received message in the container of contacts list
         */
        setTimeout(() => {
            this.mqttClient.setMessageReceivedCallback((senderId, recipientId, receivedMsg) => {
                let senderRecipientId = {
                    senderId: senderId,
                    receiverId: recipientId
                }
                this.senderReceiverIdContainer.push(senderRecipientId)
                this.msg = receivedMsg.payloadString
                // console.log(`Finally the received message is: ${this.msg} from: ${senderId} to: ${recipientId}`)
                this.mqttUpdateReceivedMessage(senderId, recipientId, this.msg)
                // console.log(`Now pushing received message: ${this.msg}`)
            })
        }, 1000)
    },
    computed: {},
    methods: {
        //Switch between addFriend and searchFriend
        switchAddSearchFriend() {

            if (this.addSearchFlag === true) {
                this.getAcceptedFriendId()
                this.showFriendContacts()
                // console.log(`true This addFriendFlag = ${this.addSearchFlag}`)
                this.addSearchFlag = false
            } else {
                this.hideFriendContacts()
                const addFriendInputField = document.getElementById("addFriend");
                addFriendInputField.value = '';
                // console.log(`False This addFriendFlag = ${this.addSearchFlag}`)
                this.addSearchFlag = true

            }
        },
        async addOrSearchFriend() {
            let stringName = document.getElementById("searchField").value.toLowerCase();
            let searchFieldInput = stringName.replace(/[^a-zA-Z0-9]/g, ""); // Remove non-alphanumeric characters


            if (this.addSearchFlag === true) {
                // console.log(`This is addFriend`)
                await this.addNewContact()
            } else {
                this.searchAndDisplayFriendContact(searchFieldInput)
            }
        },
        /**
         * First hide the search container/display addFriend container
         */
        async addNewContact() {
            //Hide searchContact container and display addContainer
            let contactList = document.getElementsByClassName("contact-list")
            let contactListAddFriend = document.getElementsByClassName("contact-list addFriend")
            contactListAddFriend[0].style.display = "flex"
            contactList[0].style.display = "none"
            let stringName = document.getElementById("addFriend").value.toLowerCase();
            let addFriendInput = stringName.replace(/[^a-zA-Z0-9]/g, ""); // Remove non-alphanumeric characters


            // const contact = document.getElementsByClassName("contact");
            if (!addFriendInput) {
                console.log(`Empty`)
                let addFriendContainer = document.getElementsByClassName("contact-list addFriend")
                addFriendContainer[0].innerHTML = ``
            } else {
                // console.log(`another`)
                let isNameInArray = this.friendContainer.some(user => `${user.name.toLowerCase()}` === `${addFriendInput}`)
                if (isNameInArray === true) {
                    //Displays friendship status with status = "accepted"
                    console.log(`Displays begin running`)
                    this.searchAndDisplayFriendContact(addFriendInput)
                }else{
                    await this.friendshipStatusCheck(addFriendInput, this.userObjectId)
                }
            }

        },

        /**
         * Searching a contact in contact container and displays it.
         * @param searchFieldInput, searching name.
         */
        searchAndDisplayFriendContact(searchFieldInput) {
            //display searchContact container and hide addContainer
            let contactList = document.getElementsByClassName("contact-list")
            let contactListAddFriend = document.getElementsByClassName("contact-list addFriend")
            contactListAddFriend[0].style.display = "none"
            contactList[0].style.display = "flex"
            let x = document.getElementsByClassName("contact")
            for (let i = 0; i < x.length; i++) {
                console.log(`Looping`)
                x[i].style.display = x[i].innerHTML.toLowerCase().includes(searchFieldInput)
                    ? "flex"
                    : "none";
            }
        },
        async friendshipStatusCheck(searchingName, myUserId) {
            const friends = await this.api.checkFriendshipStatus(searchingName, myUserId)
            if (friends.data.length !== 0){
                if (friends.data.some(friend => friend.status === "pending") &&
                    friends.data.some(friend => friend.user1_id === myUserId)) {
                    // console.log(`I am the one who sent the request`)
                } else {
                    this.createFriendPendingStatusCard(searchingName, myUserId)
                }
            } else{
                // console.log(`This checking exists user`)
                await this.createAddNewFriendCard(searchingName, myUserId)
            }
        },
        /**
         * First checks if the user exists, if the user exists create an appropriate card to be added
         * @param searchingName
         * @param userId
         */
        async createAddNewFriendCard(searchingName, myUserId) {
            const users = await this.api.getAllUsers()
            const user = users.find(user => `${user.username.toLowerCase()}` === `${searchingName}`)
            if(user){
                this.addFriendCard(searchingName, user.user_id)
                console.log(`id  ${user.user_id}`)
            }else {
                    console.log(`Not a registered User`)
            }
        },
        addFriendCard(username, userId) {
            const contactDivRequest = document.createElement("div");
            contactDivRequest.innerHTML = `
                <div class="add no-select" id="${userId}">
                    <div class="picture">
                        <img style="background: #abacae; width: 100%; height: 100%;">
                    </div>
                    <div class="text">
                        <div class="name-and-date">
                            <div class="name">${username}</div>
                            <div class="btn">
                                <div class="click addBtn">Add</div>
                            </div>
                        </div>
                        <div class="name"></div>
                        <div class="msg">Request sent</div>
                    </div>
                </div>`;
            let contactList = document.querySelector(".contact-list.addFriend");
            let existingContact = document.getElementById(userId);
            if (existingContact === null) {
                contactList.appendChild(contactDivRequest);
            }
            this.onclickAddFriend(userId, this.userObjectId)
        },
        onclickAddFriend(newFriendId, myUserId) {
            console.log(`This is running`)
            let addBtn = document.getElementsByClassName("click addBtn")
            let msg = document.getElementsByClassName("msg")
            addBtn[0].addEventListener('click', async () => {
                const response = await this.api.setFriendRequestAPI(newFriendId, myUserId)
                console.log(`Response status: ${response.status}`)
                if(`${response.status}` === `${200}`){
                    for (let i = 0; i < msg.length; i++) {
                        msg[i].style.display = "flex"
                    }
                    addBtn[0].style.display = "none"
                }
            })
        },
        /**
         * Function creates a div of the friend you're looking for to be displayed
         * @param username, username of the friend you're looking for
         */
        createFriendPendingStatusCard(username, myUserId) {
            const contactDiv = document.createElement("div");
            contactDiv.className = "add no-select";
            contactDiv.id = myUserId;
            contactDiv.innerHTML = `
            <div class="picture">
              <img style="background: #abacae; width: 100%; height: 100%;" />
            </div>
            <div class="text">
              <div class="name-and-date">
                <div class="name">${username}</div>
                <div class="btn">
                  <div class="click yes">Accept</div>
                  <div class="click no">Cancel</div>
                </div>
              </div>
              <div class="msg" id="${username}"> Request accepted</div>
            </div>
          `;
            const contactList = document.getElementsByClassName("contact-list addFriend");
            const existingContact = document.getElementById(myUserId);
            if (existingContact === null) {
                contactList[0].appendChild(contactDiv);
            }
            this.acceptOrRefuseRequest(username, myUserId)
        },
        acceptOrRefuseRequest(username, myUserId) {
            const yesBtn = document.getElementsByClassName("click yes")
            const noBtn = document.getElementsByClassName("click no")
            let btn = document.getElementsByClassName("btn")
            let msg = document.getElementsByClassName("msg")
            yesBtn[0].addEventListener("click",  () => {
                console.log(`Clicked yes`)
                this.api.acceptOrCancelFriendRequest(true, username, myUserId)
                for (let i = 0; i < msg.length; i++) {
                    console.log(`reading_`)
                    msg[i].style.display = "flex"
                }
                btn[0].style.display = "none"
                //Refresh container after accepting friend request
                this.getAcceptedFriendId()


            })
            noBtn[0].addEventListener("click",  ()=>{
                let addFriendContainer = document.getElementsByClassName("contact-list addFriend")
                this.api.acceptOrCancelFriendRequest(false, username, myUserId)
                for (let i in addFriendContainer) {
                    addFriendContainer[0].innerHTML = ``
                }

            })

        },

        /**
         * Function is connecting to mqtt broker
         */
        mqttConnection() {
            const prefix = this.username
            const randomId = Math.random().toString(36).substring(2, 9)
            this.mqttClient = new PahoMqtt(`${prefix}${randomId}`
            )
            setTimeout(() => {
                this.mqttClient.connectToBroker()
                /**
                 * Subscribe to my MQTT topic (username+userid)
                 */
                setTimeout(() => {
                    this.mqttClient.subscribeToTopic(`friends/chat`)
                    console.log(`Connected to my Topic, subscribe: friends/chat`)
                }, 1000)
            }, 2000)
        },

        /**
         * 1/ I am getting all the user's friends ids with status of ACCEPTED in DB using
         * getAcceptedFriendsId function
         * 2/I use those ids to get all the users data by id using getUserById function
         * 3/ I use the same userId from the first step to get their picture using
         * getImageFromAPI function
         */
        async getAcceptedFriendId() {
            const id = await this.api.getAcceptedFriendsId(this.userObjectId)
            for (let index in id.data) {
                if (id.data[index].user_id === this.userObjectId) {
                    continue
                }
                await this.getFriendByIdAndPush(id.data[index].user_id)
            }
        },
        /**
         * Get each friendId and others datas and push in container of array as objects
         * @param friendId
         */
        async getFriendByIdAndPush(friendId) {
            const users = await this.api.getUserById(friendId)
            const path = await this.api.getImageFromAPI(friendId)
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
                phone: users[0].phone,
                highlightFlag: false
            }
            //push user in contact list container
            this.friendContainer.push(friend)
            this.removeDoubleInFriendContainer()
        },
        removeDoubleInFriendContainer(){
            const uniqueFriends = {}
            this.friendContainer.forEach((friend, index) =>{
                if(!uniqueFriends.hasOwnProperty(friend.userId)){
                    uniqueFriends[friend.userId] = true
                }else{
                    this.friendContainer.splice(index, 1)
                }
            })
        },
        // pushReceivedMsg(){
        //     for(let index in this.friendContainer){
        //         for(let index2 in this.senderReceiverIdContainer){
        //             if(this.senderReceiverIdContainer[index2].senderId === `${this.friendContainer[index].userId}`
        //                 && `${this.senderReceiverIdContainer[index2].receiverId === `${this.userObjectId}`}`){
        //                 const receivedMessageDiv = document.createElement("div");
        //                 const receivedMessageTextP = document.createElement("p");
        //                 receivedMessageDiv.className = "message-received-div";
        //                 receivedMessageDiv.style.textAlign = "left";
        //                 receivedMessageTextP.className = "message-text";
        //
        //                 receivedMessageTextP.textContent = this.msg
        //                 receivedMessageDiv.appendChild(receivedMessageTextP)
        //                 setTimeout(()=>{
        //                     this.messagesContainer.appendChild(receivedMessageDiv)
        //                 },10)
        //                 console.log(`Mqtt received msg pushed`)
        //
        //             }else{
        //                 console.log('Not concerning you please')
        //             }
        //
        //         }
        //     }
        //
        // },
        /**
         * First loop search in friendContainer array.
         * Find the corresponding topic through the userId.
         * Set msg in contact list to new received message
         */
        mqttUpdateReceivedMessage(senderId, receiverId, receivedMsg) {
            // const friend = this.friendContainer.find(friend => `${friend.userId}` === `${senderId}`)
            // if(friend === true && `${this.userObjectId}` === `${receiverId}`){
            //     friend.msg = receivedMsg
            //     friend.highlightFlag = true
            //
            //     /**
            //      * Click the current clicked friend to see the new message when it arrives
            //      */
            //     if (`${this.friendClickedId}` === `${senderId}`) {
            //         setTimeout(() => {
            //             document.getElementById(`${this.friendClickedId}`).click()
            //         }, 200)
            //     } else {
            //         this.smsAudio.play()
            //             .catch(error => {
            //                 console.log(`Notification ringtone error: ${error}`)
            //             })
            //     }
            // }
            // console.log('This working ... received msg')
            for (let friend in this.friendContainer) {
                if (`${this.friendContainer[friend].userId}` === `${senderId}`
                    && `${this.userObjectId}` === `${receiverId}`) {
                    this.friendContainer[friend].msg = receivedMsg
                    this.friendContainer[friend].highlightFlag = true

                    /**
                     * Click the current clicked friend to see the new message when it arrives
                     */
                    if (`${this.friendClickedId}` === `${senderId}`) {
                        setTimeout(() => {
                            document.getElementById(`${this.friendClickedId}`).click()
                        }, 200)
                    } else {
                        this.smsAudio.play()
                            .catch(error => {
                                console.log(`Notification ringtone error: ${error}`)
                            })
                    }
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
        async getClickedUserId(index, friendId) {
            let containerDiv = this.messagesContainer = document.getElementById("messages-box");
            containerDiv.textContent = ''
            this.friendClickedId = friendId
            this.userActivateId = index
            this.userClicked = this.friendContainer[index].name
            this.onclickUser = true
            let input = document.getElementById("addFriend")
            input.value = ''

            /**
             * Checking if the clicked friend received a new msg, by checking its id in the received new msg container.
             * If it's found, onclick the id is removed from the container and the msg color change to black
             * by setting highlight to False
             */
            for (let index in this.senderReceiverIdContainer) {
                if (`${this.senderReceiverIdContainer[index].senderId}` === `${this.friendClickedId}`
                    && `${this.senderReceiverIdContainer[index].receiverId}` === `${this.userObjectId}`) {
                    this.senderReceiverIdContainer.splice(index, 1)
                    for (let index in this.friendContainer) {
                        if (`${this.friendContainer[index].userId}` === `${this.friendClickedId}`) {
                            this.friendContainer[index].highlightFlag = false
                        }
                    }

                }
            }
            /**
             * The API function is displaying saved history messages from DB to UI of
             * each friends
             */
            const response = await this.api.getMsgHistoryFromAPI(this.userObjectId, friendId)
            for (let index in response.data) {
                // console.log(`msg from data: ${response.data[index].message_txt}`)
                if (response.data[index].to_contact_id === this.userObjectId && response.data[index].from_contact_id === friendId) {
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


                } else if (response.data[index].to_contact_id === friendId && response.data[index].from_contact_id === this.userObjectId) {
                    // console.log(`${friendId}: ${response.data[index].message_txt}`)

                    const sentMessageDiv = document.createElement("div");
                    sentMessageDiv.className = "message-sent";
                    sentMessageDiv.style.textAlign = "left";

                    const sentMessageText = document.createElement("p");
                    sentMessageText.textContent = response.data[index].message_txt
                    sentMessageDiv.appendChild(sentMessageText)
                    containerDiv.appendChild(sentMessageDiv)
                } else {
                    console.log(`No message`)
                }
            }


            //scroll to the bottom to see the last message
            setTimeout(() => {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight
            }, 25)
            // this.pushReceivedMsg()


        },
        async pushMessage() {
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
                setTimeout(() => {
                    this.messagesContainer.appendChild(sentMessageDiv)
                }, 250)
                /**
                 * The API is saving sending message
                 * @param this.userObjectId which is userId
                 * @param textareaContent => Text Message
                 * @param this.friendClickedId which is the friend who receives the message
                 */
                this.api.saveMsgToDB(this.userObjectId, textareaContent, this.friendClickedId)
                console.log(`Message to DB`)
                setTimeout(() => {
                    this.mqttClient.publishToBroker(`${this.userObjectId}`, `${this.friendClickedId}`, textareaContent)
                    console.log(` From ${this.userObjectId} to : ${this.friendClickedId} message: ${textareaContent}`)
                }, 7000)

                //Scroll down to see the recent sent message
                setTimeout(() => {
                    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight
                }, 500)

            }
            //Clear text-box
            setTimeout(() => {
                document.getElementById("text-box").value = ""
            }, 200)


        },
        /**
         * Function hides the all user contacts with status of "accepted" in contact-list class
         */
        hideFriendContacts() {
            const addContainer = document.getElementsByClassName("contact")
            for (let i = 0; i < addContainer.length; i++) {
                addContainer[i].style.display = "none"
            }
        },
        showFriendContacts() {
            const addContainer = document.getElementsByClassName("contact")
            for (let i = 0; i < addContainer.length; i++) {
                addContainer[i].style.display = "flex"
            }
        }
    }
}



