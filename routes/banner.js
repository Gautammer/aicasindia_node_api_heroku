const express = require('express');
const router = express.Router();
var connection = require('../config/db.config');

//!add banner api
router.post('/add_banner', (req, res) => {
    let body = req.body;

    connection.query('INSERT INTO banner SET ?', body, function (err, result) {
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
                    message: "banner Added Successfully",
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

//!delete banner
router.post('/delete_banner', (req, res) => {
    let body = req.body;
    //console.log(body)
    connection.query(`DELETE FROM banner  WHERE id = ${body.id} `, function (err, result) {
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

//! get banner 
router.get('/get_banner', (req, res) => {
    connection.query(`SELECT * FROM banner `,  function (err, result) {
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
                    message: "get all banner",
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