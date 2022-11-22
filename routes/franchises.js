const express = require('express');
const router = express.Router();
var connection = require('../config/db.config');


//!register api
router.post('/register', (req, res) => {
   // res.header("Access-Control-Allow-Origin", "*")
    let body = req.body;
    body.created_at=new Date().toISOString();
    connection.query(`SELECT * FROM franchises WHERE registration_no = '${body.registration_no}'`, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        } else {
            if (result.length) {
                res.json({
                    status: false,
                    message: 'User is already registered with this registration number.'
                });
            } else {
                connection.query('INSERT INTO franchises SET ?', body, (err) => {
                    if (err) {

                        res.json({
                            status: false,
                            message: err.sqlMessage
                        });

                    }
                    res.json({
                        status: true,
                        message: "done"
                    });
                });

            }
        }
    });

});

//!login api

router.post('/login', (req, res) => {
    let body = req.body;
    console.log(body)
    connection.query(`SELECT * FROM franchises WHERE registration_no = '${body.registration_no}' AND password = '${body.password}'`,function (err, result){
       if(err){
        res.json({
            status: false,
            message: err.sqlMessage
        });
       } else{
        if (result.length) {
            res.json({
                status: true,
                message: 'Login successfully',
                data:result[0]
            });
        }else{
            res.json({
                status: false,
                message: 'Id or Password not matched'
            }); 
        }
       }
    })
})

// //!update api

router.post('/update', (req, res) => {
    let body = req.body;
  //  console.log(body)
    connection.query(`UPDATE franchises SET ? WHERE id = ${body.id} `,body ,function (err, result){
        if(err){
            res.json({
                status: false,
                message: err.sqlMessage
            });
        }else{
            if(result){
                res.json({
                    status: true,
                    message: "updated"
                });
            }else{
                res.json({
                    status: false,
                    message: 'not update'
                });  
            }
        }
    })
})

//!delete api

// router.post('/delete', (req, res) => {
//     let body = req.body;
//     //console.log(body)
//     connection.query(`DELETE FROM franchises  WHERE id = ${body.id} `,body ,function (err, result){
//         console.log(result)
//         if(err){
//             res.json({
//                 status: false,
//                 message: err.sqlMessage
//             });
//         }else{
//             if(result){
//                 res.json({
//                     status: true,
//                     message: "deleted"
//                 });
//             }else{
//                 res.json({
//                     status: false,
//                     message: 'not deleted'
//                 });  
//             }
//         }
//     })
// })

//!get all franchises
router.get('/getAllFranchises', (req, res) => {
    connection.query(`SELECT * FROM franchises`,function (err, result){
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        } else {
            if (result) {
                res.json({
                    status: true,
                    message: "get all franchises",
                    data:result
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

//!get Franchises by its ID
router.post('/getFranchiseById', (req, res) => {
    let body = req.body;
    connection.query(`SELECT * FROM franchises WHERE id = ?`, body.franchise_id,function (err, result){
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        } else {
            if (result) {
                res.json({
                    status: true,
                    message: "get franchise by id",
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
 
//! delete status change api 
router.post('/deleteFranchises', (req, res) => {
    let body = req.body;
    //console.log(body)
    connection.query(`UPDATE franchises SET isDeleted = ? WHERE id = ${body.id} `,body.isDeleted ,function(err, result){
        console.log(result)
        if(err){
            res.json({
                status: false,
                message: err.sqlMessage
            });
        }else{
            if(result.affectedRows){
                res.json({
                    status: true,
                    message: "deleted",
                    data:result
                });
            }else{
                res.json({
                    status: false,
                    message: 'not deleted'
                });  
            }
        }
    })
})
//! Franchises Approve status change api 
router.post('/approveFranchise', (req, res) => {
    let body = req.body;
    //console.log(body)
    connection.query(`UPDATE franchises SET isApprove = ? WHERE id = ${body.id} `,body.isApprove ,function(err, result){
        console.log(result)
        if(err){
            res.json({
                status: false,
                message: err.sqlMessage
            });
        }else{
            if(result.affectedRows){
                res.json({
                    status: true,
                    message: "Status changed",
                    data:result
                });
            }else{
                res.json({
                    status: false,
                    message: 'Status not changed'
                });  
            }
        }
    })
})


//! get all approve franchises length  is_deleted=false api
router.get('/get_all_franchises_length', (req, res) => {
    let body = req.body;

    connection.query(`SELECT * FROM franchises WHERE isDeleted=false` ,function(err,result){
        if(err){
            res.json({
                status: false,
                message: err.sqlMessage,
                data: []
            });
        }else{
            if(result){
                res.json({
                    status: true,
                    message: "Get all approve franchises",
                    data:result.length
                });
            }else{
                res.json({
                    status: false,
                    message: 'Status not changed'
                });  
            }
        }
    })

})
module.exports = router;