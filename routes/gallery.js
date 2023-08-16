const express = require('express');
const router = express.Router();
var connection = require('../config/db.config');

//!add gallery api
router.post('/add_galleryImage', (req, res) => {
    let body = req.body;

    connection.query('INSERT INTO gallery SET ?', body, function (err, result) {
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
                    message: "image Added Successfully",
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

//!delete gallery
router.post('/delete_galleryImage', (req, res) => {
    let body = req.body;
    //console.log(body)
    connection.query(`DELETE FROM gallery  WHERE id = ${body.id} `, function (err, result) {
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

//! get gallery
router.get('/get_galleryImage', (req, res) => {
    connection.query(`SELECT * FROM gallery `,  function (err, result) {
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
                    message: "get all image",
                    data: result
                });
            } else {
                res.json({
                    status: false,
                    message: 'No banner found!',
                    data: []
                });
            }
        }
    })
})

module.exports = router;