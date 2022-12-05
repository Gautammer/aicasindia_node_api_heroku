const express = require('express');
const router = express.Router();
var connection = require('../config/db.config');

//!get admin id password
// router.get('/get_admin', (req, res) => {
// connection.query(`SELECT * FROM admin`,function (err, result){
//     if (err) {
//         res.json({
//             status: false,
//             message: err.sqlMessage
//         });
//     } else {
//         if (result) {
//             res.json({
//                 status: true,
//                 message: "Successfully get admin",
//                 data:result[0]
//             });
//         } else {
//             res.json({
//                 status: false,
//                 message: 'Something went wrong!'
//             });
//         }
//     } 
// })
// })


//! admin login
router.post('/admin_login', (req, res) => {
    let body = req.body;
    // console.log(body)
    connection.query(`SELECT * FROM admin WHERE email = '${body.email}' AND password = '${body.password}'`, function (err, result) {
        console.log(result)
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        } else {
            if (result.length) {
                res.json({
                    status: true,
                    message: 'Login successfully',
                    data: result[0]

                });
            } else {
                res.json({
                    status: false,
                    message: 'Id or Password not matched'
                });
            }
        }
    })
})
module.exports = router;