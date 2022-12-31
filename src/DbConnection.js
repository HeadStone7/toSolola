// import { createConnection } from 'mysql';
const mysql = require('mysql2');


class DbConnection{

    constructor(){
        this.pool = mysql.createPool({
            host : 'localhost',
            user: 'root',
            password: '123456789',
            database: 'chatapp',
            connectionLimit: 10,
            multipleStatements: true,
            waitForConnections: true,
            debug: false,
            queueLimit: 0
        })

        this.connection = this.pool.promise() 

    }

    async selQuery(){
        const [res, zoe] = await this.connection.execute("SELECT * FROM contact")
        console.log(zoe)
        console.log(res)
    }
}

// const connection = createPool({
//     host : 'localhost',
//     user: 'root',
//     password: '123456789',
//     database: 'chatapp',
//     connectionLimit: 10,
//     multipleStatements: true
// });
// console.log("connection..."+ connection)

// // let row = function(){
// connection.query('SELECT * FROM message', (err, rows) =>{
//       if(err) throw err;
//           console.log('Data received from Db:');
//           console.log(rows);
// })
// }  

// function connectionG(){
//   return connection;
// }

module.exports = DbConnection