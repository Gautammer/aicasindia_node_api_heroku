const express = require('express');
const router = express.Router();
var connection = require('../config/db.config');


//!add materials api
router.post('/add_materials', (req, res) => {
    let body = req.body;

    connection.query('INSERT INTO materials SET ?', body, function (err, result) {
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
                    message: "Material Added Successfully",
                    data: result
                });
            }else{
                res.json({
                    status: false,
                    message: "Something went wrong!",
                    data: err
                });
            }

        }

    })
})

//! get Materials 
router.post('/get_materials', (req, res) => {
    let body = req.body;
    connection.query(`SELECT * FROM materials WHERE franchises_id = ?`, body.franchises_id, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage,
                data: []
            });
        } else {
            if (result.length) {
                res.json({
                    status: true,
                    message: "get all materials",
                    data: result
                });
            } else {
                res.json({
                    status: false,
                    message: 'No materials found!',
                    data: []
                });
            }
        }
    })
})

//!delete Material
router.post('/delete_material', (req, res) => {
    let body = req.body;
    //console.log(body)
    connection.query(`DELETE FROM materials  WHERE id = ${body.id} `, body, function (err, result) {
        console.log(result)
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        } else {
            if (result) {
                res.json({
                    status: true,
                    message: "deleted"
                });
            } else {
                res.json({
                    status: false,
                    message: 'not deleted'
                });
            }
        }
    })
})
module.exports = router;