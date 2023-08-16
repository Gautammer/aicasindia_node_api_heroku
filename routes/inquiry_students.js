const express = require('express');
const router = express.Router();
var connection = require('../config/db.config');

//!students inquiry add api
router.post('/add_inquiry_students', (req, res) => {
    let body = req.body;

    connection.query('INSERT INTO inquiry_students SET ?', body, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        }
        else {

            if (result) {
                res.json({
                    status: true,
                    message: "Student inquiry added successfully",
                    data: result
                });
            } else {
                res.json({
                    status: false,
                    message: err.sqlMessage,
                    data: []
                });
            }

        }

    })
})

//!get students inquiry
router.get('/get_inquiry_students', (req, res) => {
    let body = req.body;

    connection.query(`SELECT * FROM inquiry_students`,function (err, result){
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        }
        else {

            if (result) {
                res.json({
                    status: true,
                    message: "Students inquiry got",
                    data: result
                });
            } else {
                res.json({
                    status: false,
                    message: err.sqlMessage,
                    data: []
                });
            }

        }

    })
})






module.exports = router;