// const { contextBridge, ipcRenderer } = require('electron')
// const mysql = require('mysql2');
//
// // function connectionFun(){
//
// //       const connection = mysql.createConnection({
// //         host: 'localhost',
// //         user: 'root',
// //         password: '123456789',
// //         database: 'chatapp'
// //       });
// //       connection.connect((err) => {
// //         if (err) {
// //           console.error(err);
// //         } else {
// //           console.log('Connected to MySQL database');
// //         }
// //       });
//
// //       return connection;
// // }
// // console.log("Still going on !!!!")
//
// // ipcRenderer.send('mysqlConnection', connection)
// contextBridge.exposeInMainWorld('api', {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron,
//   // connectionFun
//   // we can also expose variables, not just functions
// })
//
