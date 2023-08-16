const express = require('express');
const router = express.Router();
var connection = require('../config/db.config');


//!register api
router.post('/register', (req, res) => {
    // res.header("Access-Control-Allow-Origin", "*")
    let body = req.body;
    body.created_at = new Date().toISOString();
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
    connection.query(`SELECT * FROM franchises WHERE registration_no = '${body.registration_no}' AND password = '${body.password}'`, function (err, result) {
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

// //!update api

router.post('/update', (req, res) => {
    let body = req.body;
    //  console.log(body)
    connection.query(`UPDATE franchises SET ? WHERE id = ${body.id} `, body, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        } else {
            if (result) {
                res.json({
                    status: true,
                    message: "updated"
                });
            } else {
                res.json({
                    status: false,
                    message: 'not update'
                });
            }
        }
    })
})

//!get all franchises
router.get('/getAllFranchises', (req, res) => {
    connection.query(`SELECT * FROM franchises`, function (err, result) {
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
                    data: result
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
//! get all franchises by pagination
router.get('/getAllFranchises_pagination', (req, res) => {
    connection.query(`SELECT id, email, password, address, birthdate, center_address, center_city, center_name, center_state, center_zip, city, contact_no, father_name, propriter_name, mobile_no, nominee_name, nominee_relation, isDeleted, created_at, space, state, suggetion, total_computer, total_faculty, zip, registration_no, isApprove FROM franchises`, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        } else {
            if (result) {
                const resultsPerPage = 10;
                const numOfResults = result.length;
                const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
                let page = req.query.page ? Number(req.query.page) : 1;
                if (page > numberOfPages) {
                    console.log('line 484', err)
                    res.json({
                        status: false,
                        message: "No more data",
                    });
                } else if (page < 1) {
                    console.log('line 490', err)
                    res.json({
                        status: false,
                        message: "No more data",
                    });
                } else {
                    const startlingLimit = (page - 1) * resultsPerPage;
                    //   sql = `SELECT * FROM students`;
                    connection.query(`SELECT id, email, password, address, birthdate, center_address, center_city, center_name, center_state, center_zip, city, contact_no, father_name, propriter_name, mobile_no, nominee_name, nominee_relation, isDeleted, created_at, space, state, suggetion, total_computer, total_faculty, zip, registration_no, isApprove FROM franchises  LIMIT ${startlingLimit},${resultsPerPage}`, function (err, result) {

                        if (err) {
                            console.log('line 503', err)
                            res.json({
                                status: false,
                                message: "No more data",
                            });
                        } else {
                            if (result) {
                                let iterator = (page - 5) < 1 ? 1 : page - 5;
                                let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages);
                                if (endingLink < (page + 4)) {
                                    iterator -= (page + 4) - numberOfPages;
                                }
                                // res.render('index',{data:result,page,iterator,endingLink,numberOfPages});
                                res.json({
                                    status: true,
                                    message: "got",
                                    data: result
                                });
                            }
                        }

                    })
                }
            }
        }
    })
})

//!get Franchises by its ID
router.post('/get_single_franchise', (req, res) => {
    let body = req.body;
    connection.query(`SELECT * FROM franchises WHERE registration_no = ?`, body.franchise_id, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        } else {
            if (result) {
                res.json({
                    status: true,
                    message: "get franchise",
                    data: result[0]
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
    connection.query(`UPDATE franchises SET isDeleted = ? WHERE id = ${body.id} `, body.isDeleted, function (err, result) {
        console.log(result)
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        } else {
            if (result.affectedRows) {
                res.json({
                    status: true,
                    message: "deleted",
                    data: result
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
//! Franchises Approve status change api 
router.post('/approveFranchise', (req, res) => {
    let body = req.body;
    //console.log(body)
    connection.query(`UPDATE franchises SET isApprove = ? WHERE id = ${body.id} `, body.isApprove, function (err, result) {
        console.log(result)
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        } else {
            if (result.affectedRows) {
                res.json({
                    status: true,
                    message: "Status changed",
                    data: result
                });
            } else {
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

    connection.query(`SELECT * FROM franchises WHERE isDeleted=false`, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage,
                data: []
            });
        } else {
            if (result) {
                res.json({
                    status: true,
                    message: "Get all approve franchises",
                    data: result.length
                });
            } else {
                res.json({
                    status: false,
                    message: 'Status not changed'
                });
            }
        }
    })

})
//! searchbar api of franchises 
router.post('/search_franchise', (req, res) => {
    let body = req.body;
  
    connection.query(`SELECT * FROM franchises WHERE isDeleted=false AND propriter_name LIKE '${body.string}' OR registration_no LIKE '${body.string}'  AND isDeleted=false `,body,  function (err, result) {
        if (err) throw err;
        var data=[];
       // console.log(result)
        for(i=0;i<result.length;i++)
        {
            data.push(result[i]);
        }
        res.json({
            status: true,
            message: 'found',
            data: result
        });
    })
})
module.exports = router;