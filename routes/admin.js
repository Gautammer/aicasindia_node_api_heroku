const express = require('express');
const router = express.Router();
var connection = require('../config/db.config');

//!get admin id password
router.get('/get_admin', (req, res) => {
connection.query(`SELECT * FROM admin`,function (err, result){
    if (err) {
        res.json({
            status: false,
            message: err.sqlMessage
        });
    } else {
        if (result) {
            res.json({
                status: true,
                message: "Successfully get admin",
                data:result[0]
            });
        } else {
            res.json({
                status: false,
                message: 'Something went wrong!'
            });
        }
    } 
})
})

module.exports = router;