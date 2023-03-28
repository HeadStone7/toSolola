/* eslint-disable */
import Paho from 'paho-mqtt'

export class PahoMqtt{
    constructor(clientId) {
        this.client = new Paho.Client('localhost', 9001, clientId)
        this.client.onConnectionLost = this.onConnectionLost.bind(this)
        // this.client.onMessageArrived = this.onMessageArrived.bind(this)

    }

    /**
     * Function connects to the broker and response whether it's connected or connection failed
     */
    connectToBroker(){
        setTimeout(() =>{
            this.client.connect({
                onSuccess: () =>{
                    console.log('MQTT client connecting... => connected');
                },
                onFailure: (err) =>{
                    console.error('MQTT connection failed: ', err)
                },
                // keepalive: 60
            }, 3000)
        })
    }
    subscribeToTopic(topic){
        const subscribeOption = {
            qos: 1,
            invocationContext: { foo: true},
            onSuccess: this.onSuccessCallback,
            onFailure: this.onFailureCallback,
        }
        this.client.subscribe(topic, subscribeOption)
    }

    unsubscribeToBroker(topic){
        this.client.unsubscribe(topic)
    }
    publishToBroker(myId,recipientId, msg){
        const message = new Paho.Message(msg)
        message.retained = false
        const payload = {
            from: myId,
            to: recipientId,
            msg: message
        };

        this.client.send(`friends/chat`, JSON.stringify(payload), 1)

        // this.client.onMessageArrived = function (message) {
        //     console.log(`Message Arrived: ${message.payloadString}`);
        //     console.log(`Topic: ${message.destinationName}`)
        //     console.log(`Qos: ${message.qos}`)
        //     console.log(`Retained: ${message.retained}`)
        //     console.log(`Duplication: ${message.duplicate}`)
        // }
    }

    onConnectionLost(err){
        console.error('MQTT connection lost: ', err)
        setTimeout(()=>{
            console.log(`Reconnecting...`)
            this.connectToBroker()
        },500)
    }

    setMessageReceivedCallback(callback){
        // console.log('MQTT message received: ', message.payloadString)
        this.client.onMessageArrived = (message) =>{
            const payload = JSON.parse(message.payloadString)
            const receivedMsg = payload.msg
            const senderId = payload.from
            const recipientId = payload.to
            callback(senderId, recipientId, receivedMsg)
        }

    }

    onSuccessCallback(){
        console.log(`subscription success`)
    }

    onFailureCallback(){
        console.log(`subscription Failed`)
    }
}