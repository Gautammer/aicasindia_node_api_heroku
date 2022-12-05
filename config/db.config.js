const mysql = require('mysql');

//! database
//create here mysql connection
const dbConnection = mysql.createConnection({ 
    host:'localhost',
    user:'root',
    password:'',
    database:'aicasindia'
});

// const pool = mysql.createPool({
//     connectionLimit : 100, //important
//     host     : '217.21.84.154',
//     user     : 'u120121885_aicas',
//     password : 'Gautammer@2141',
//     database : 'u120121885_aicasindia',
//     debug    :  false
// });
//! .......
// const dbConnection = mysql.createConnection({
//     host:'217.21.84.154',
//     user:'u120121885_aicas',
//     password:'Gautammer@2141',
//     database:'u120121885_aicasindia'
// });

dbConnection.connect(function(error){
    if(error) throw error;
    console.log('Database Connected Successfully !');
});




//module.exports = pool;
module.exports = dbConnection;
