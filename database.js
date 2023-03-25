const mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    database: "mydb",
    user: 'root',
    password: '12345678',
    multipleStatements: true
})

connection.connect(function (error) {
    if (error) {
        throw error;
    }
    else {
        console.log("MySQL is connected");
    }
})

module.exports = connection;