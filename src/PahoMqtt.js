/* eslint-disable */
import Paho from 'paho-mqtt'

export class PahoMqtt{
    constructor(options) {
        this.client = new Paho.Client(options.hostname, options.port, "ClientId")
        this.client.onConnectionLost = this.onConnectionLost.bind(this)
        // this.client.onMessageArrived = this.onMessageArrived.bind(this)
        this.client.qos = 1
    }

    connectToBroker(){
        setTimeout(() =>{
            this.client.connect({
                onSuccess: () =>{
                    console.log('MQTT client connecting... => connected');
                },
                onFailure: (err) =>{
                    console.error('MQTT connection failed: ', err)
                }

            }, 3000)
        })
    }
    subscribeToTopic(topic){
        const subscribeOption = {
            qos: 1,
            invocationContext: { foo: true},
            onSuccess: this.onSuccessCallback,
            onFailure: this.onFailureCallback,
            timeout: 20
        }
        this.client.subscribe(topic, subscribeOption)
    }

    unsubscribeToBroker(topic){
        this.client.unsubscribe(topic)
    }
    publishToBroker(topic, payload){
        const message = new Paho.Message(payload);
        message.destinationName = topic;
        message.retained = false
        this.client.send(message)

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
    }

    setMessageReceivedCallback(callback){
        // console.log('MQTT message received: ', message.payloadString)
        this.client.onMessageArrived = (message) =>{
            const receivedMsg = message.payloadString;
            const msgTopic = message.destinationName
            callback(receivedMsg, msgTopic)
        }
    }

    onSuccessCallback(){
        console.log(`subscription success`)
    }

    onFailureCallback(){
        console.log(`subscription Failed`)
    }
}