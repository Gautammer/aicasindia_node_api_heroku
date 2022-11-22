const express = require('express');
const router = express.Router();
var connection = require('../config/db.config');

//!add franchises api firebase to mysql
router.post('/add_franchises', (req, res) => {
    let body = req.body;
    body.forEach(franchise => {
        connection.query(`INSERT INTO franchises SET ?`, franchise, function (err, result) {

        })
    });
    res.json({
        status: true,
        message: "franchises Added Successfully to mysql",
    });


})
//!add  students api firebase to mysql
router.post('/add_students', (req, res) => {
    let body = req.body;
    
        connection.query(`INSERT INTO students SET ?`, body, function (err, result) {
            if(err){
                res.json({
                    status: false,
                    message: err,
                });
            };

if(result){
    res.json({
        status: true,
        message: "students Added Successfully to mysql",
    });
}

    });
    


})



module.exports = router;