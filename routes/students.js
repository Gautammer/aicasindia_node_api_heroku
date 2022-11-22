const express = require('express');
const router = express.Router();
var connection = require('../config/db.config');

//!register api
router.post('/register', (req, res) => {
    let body = req.body;

    connection.query('INSERT INTO students SET ?', body, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        }
        else {
            const pass = body.student_name.charAt(0).toUpperCase() + body.student_name.slice(1) + '@' + body.id;
            connection.query(`UPDATE students SET password= ? WHERE id = '${body.id}' `, pass, function (err, result) {
                if (err) {
                    res.json({
                        status: false,
                        message: err.sqlMessage
                    });
                } else {
                    res.json({
                        status: true,
                        message: "done",
                        data: 'updated at ' + result.id
                    });
                }
            })
        }

    })
})


//!login api
router.post('/login', (req, res) => {
    let body = req.body;
    // console.log(body)
    connection.query(`SELECT * FROM students WHERE id = '${body.id}' AND password = '${body.password}'`, function (err, result) {
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

// //!update api

router.post('/update', (req, res) => {
    let body = req.body;
    console.log(body)
    connection.query(`UPDATE students SET ? WHERE id = '${body.id}' `, body, function (err, result) {
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

//!delete api

router.post('/delete', (req, res) => {
    let body = req.body;
    //console.log(body)
    connection.query(`DELETE FROM students  WHERE id = '${body.id}' `, body, function (err, result) {
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
// //!get all studentsByFranchises
// router.get('/getAllStudents', (req, res) => {
// connection.query(`SELECT * FROM students`,function (err, result){
//     if (err) {
//         res.json({
//             status: false,
//             message: err.sqlMessage
//         });
//     } else {
//         if (result) {
//             res.json({
//                 status: true,
//                 message: "get all students",
//                 data:result
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

//!get all studentsByFranchises
router.post('/getStudents_byFranchises', (req, res) => {
    let body = req.body;
    connection.query(`SELECT * FROM students WHERE franchises_id = ?`, body.franchises_id, function (err, result) {
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
                    message: "get all students",
                    data: result
                });
            } else {
                res.json({
                    status: false,
                    message: 'No students found!',
                    data: []
                });
            }
        }
    })
})


//!approve or disapprove api

router.post('/approve_disapprove_Student', (req, res) => {
    let body = req.body;
    console.log(body)
    body.students.forEach(student => {
        // query for approving each student.
        connection.query(`UPDATE students SET is_approved = ? WHERE id = '${student.id} '`, body.status, function (err, result) {
            if (err) {
                res.json({
                    status: false,
                    message: err,
                });

            }

        })
    });
    res.json({
        status: true,
        message: "status change successfully",

    });


});

//!get all studentsByFranchises which isExamAttended==true only those student
router.post('/getStudents_byFranchises_examAttended', (req, res) => {
    let body = req.body;
    connection.query(`SELECT * FROM students WHERE is_exam_attended=true AND franchises_id = ?`, body.franchises_id, function (err, result) {
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
                    message: "get students",
                    data: result
                });
            } else {
                res.json({
                    status: false,
                    message: 'No students found!',
                    data: []
                });
            }
        }
    })
})

//!get students by franchise id with exam detail
router.post('/getStudents_byFranchises_withExamDetail', (req, res) => {
    let body = req.body;

    connection.query(`SELECT * FROM students JOIN results ON students.id = results.student_id AND students.franchises_id=results.franchises_id WHERE students.franchises_id = ?`, body.franchises_id, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage,
                data: []
            });
        } else {
            res.json({
                status: true,
                message: "successfully got list",
                data: result
            });
        }
    });


});




//!get students by franchise id with exam detail
router.post('/getStudent_byFranchises_withExamDetail', (req, res) => {
    let body = req.body;

    connection.query(`SELECT * FROM students JOIN results ON students.id = results.student_id AND students.franchises_id=results.franchises_id WHERE students.franchises_id = ? AND students.id = '${body.student_id}'`, body.franchises_id, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage,
                data: []
            });
        } else {
            connection.query(`SELECT *  FROM franchises WHERE registration_no=? `, body.franchises_id, function (err2, franchise) {


                let data = {
                    student: result[0] ? result[0] : {},
                    franchise: franchise[0] ? franchise[0] : {}
                }
                res.json({
                    status: true,
                    message: "successfully got list",
                    data: data
                });

            });
        }
    });


});

//! get all approve students length api
router.get('/get_all_approve_students', (req, res) => {
    let body = req.body;

    connection.query(`SELECT * FROM students WHERE is_approved=true`, function (err, result) {
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
                    message: "Get all approve students",
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


//! admin dashboard api for show approved students & franchises
router.get('/get_admin_dashboard', (req, res) => {
    let body = req.body;

    connection.query(`SELECT * FROM students WHERE is_approved=true`, function (err, result1) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage,
                data: []
            });
        } else {
            connection.query(`SELECT * FROM franchises WHERE isDeleted=false AND isApprove=true`, function (err, result2) {

                let data = {
                    approve_students: result1.length ? result1.length : 0,
                    franchises: result2.length ? result2.length : 0
                }
                res.json({
                    status: true,
                    message: "successfully got length",
                    data: data
                });

            })
        }
    })

})

//! Partner dashboard api 
router.post('/get_partner_dashboard', (req, res) => {
    let body = req.body;

    connection.query(`SELECT * FROM students WHERE franchises_id=?`, body.franchises_id, function (err, allStudents) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage,
                data: []
            });
        } else {
            connection.query(`SELECT * FROM students WHERE is_approved=true AND franchises_id=?`, body.franchises_id, function (err, approve) {
                if (err) {
                    res.json({
                        status: false,
                        message: err.sqlMessage,
                        data: []
                    });
                } else {
                    connection.query(`SELECT * FROM students WHERE is_approved=false AND franchises_id=?`, body.franchises_id, function (err, disapprove) {
                        if (err) {
                            res.json({
                                status: false,
                                message: err.sqlMessage,
                                data: []
                            });
                        } else {
                            connection.query(`SELECT * FROM students WHERE is_exam_attended=true AND franchises_id=?`, body.franchises_id, function (err, testCompletedStudents) {
                                let data = {
                                    total_students: allStudents.length ? allStudents.length : 0,
                                    approve_students: approve.length ? approve.length : 0,
                                    disapprove_students: disapprove.length ? disapprove.length : 0,
                                    test_completed_students: testCompletedStudents.length ? testCompletedStudents.length : 0,

                                }
                                res.json({
                                    status: true,
                                    message: "successfully got length",
                                    data: data
                                });
                            })
                        }
                    })
                }


            })
        }
    })

})

//! make id of students



router.get('/get_last_student', (req, res) => {
    let body = req.body;

    connection.query(`SELECT * FROM students ORDER BY ID DESC LIMIT 1 `, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err,
            });
        } else {
          if(result){
               var student_id = result[0].id;
               student_id = student_id.replace(/[^\d]/g, ''); 
                if(err){
                    res.json({
                        status: false,
                        message: err,
                    }); 
                }else{
                    if(result){
                        res.json({
                            status: true,
                            message: "got student id",
                            data:parseInt(student_id) 
                        });  
                    }else{
                        res.json({
                            status: false,
                            message: err,
                        }); 
                    }
                }
          }
        }
    })
})
module.exports = router;