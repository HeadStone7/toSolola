// import { createConnection } from 'mysql';
const mysql = require('mysql2');


class DbConnection{

    constructor() {
        this.pool = mysql.createPool({
                host: "localhost",
                port: "3306",
                user: "root",
                password: "NNrWwpIQS1-1",
                database: "mosungi",
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                debug: false
            }
        )
        this.connection = this.pool.promise();
    }

    async selQuery(){
        const [res, zoe] = await this.connection.execute("SELECT * FROM users")
        console.log(zoe)
        console.log(res)
    }
}

module.exports = DbConnection