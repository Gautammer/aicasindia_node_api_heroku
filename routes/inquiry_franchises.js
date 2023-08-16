const express = require('express');
const router = express.Router();
var connection = require('../config/db.config');

//!franchises inquiry add api
router.post('/add_inquiry_franchises', (req, res) => {
    let body = req.body;

    connection.query('INSERT INTO inquiry_franchises SET ?', body, function (err, result) {
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
                    message: "Franchises inquiry added successfully",
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

//!get franchises inquiry
router.get('/get_inquiry_franchises', (req, res) => {
    let body = req.body;

    connection.query(`SELECT * FROM inquiry_franchises`,function (err, result){
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
                    message: "Franchises inquiry got",
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