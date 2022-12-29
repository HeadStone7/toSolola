// // renderer.js
// const mqtt = require('mqtt')
// const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)

// const host = 'http://localhost:1883'

// console.log(window.api)
// const options = {
//   keepalive: 30,
//   clientId: clientId,
//   protocolId: 'MQTT',
//   protocolVersion: 4,
//   clean: true,
//   reconnectPeriod: 1000,
//   connectTimeout: 30 * 1000,
//   will: {
//     topic: 'chat',
//     payload: 'Connection Closed abnormally..!',
//     qos: 0,
//     retain: false
//   },
//   rejectUnauthorized: false
// }

// // Information about the mqtt module is available
// console.log(mqtt)

// console.log('connecting mqtt client')
// const client = mqtt.connect(host, options)

// client.on('error', (err) => {
//   console.log('Connection error: ', err)
//   client.end()
// })

// client.on('reconnect', () => {
//   console.log('Reconnecting...')
// })

// client.on('connect', () => {
//   console.log('Client connected:' + clientId)
//   client.subscribe('testtopic/electron', {
//     qos: 0
//   })
//   client.publish('testtopic/electron', 'Electron connection demo...!', {
//     qos: 0,
//     retain: false
//   })
// })

// client.on('message', (topic, message, packet) => {
//   console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)
// })

console.log("renderer.js console ")
