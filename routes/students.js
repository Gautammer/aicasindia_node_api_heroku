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


//!get all studentsByFranchises
router.post('/getStudents_byFranchises', (req, res) => {
    let body = req.body;
    connection.query(`SELECT id, email, password, student_name, surname, address, gender, admission_date, admission_with, birthdate, city, contact_no, course, father_name, father_no, is_approved, pincode, qualification, registration_date, franchises_id, created_at, full_name, is_exam_attended, is_review, is_direct_added FROM students WHERE is_exam_attended=true AND franchises_id = ?`, body.franchises_id, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage,
                data: []
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
                    connection.query(`SELECT id, email, password, student_name, surname, address, gender, admission_date, admission_with, birthdate, city, contact_no, course, father_name, father_no, is_approved, pincode, qualification, registration_date, franchises_id, created_at, full_name, is_exam_attended, is_review, is_direct_added FROM students  WHERE is_exam_attended=true AND franchises_id = ?  LIMIT ${startlingLimit},${resultsPerPage}`, body.franchises_id, function (err, result) {

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


// //! admin dashboard api for show approved students & franchises
// router.get('/get_admin_dashboard', (req, res) => {
//     let body = req.body;

//     connection.query(`SELECT * FROM students WHERE is_approved=true`, function (err, result1) {
//         if (err) {
//             res.json({
//                 status: false,
//                 message: err.sqlMessage,
//                 data: []
//             });
//         } else {
//             connection.query(`SELECT * FROM franchises WHERE isDeleted=false AND isApprove=true`, function (err, result2) {

//                 let data = {
//                     approve_students: result1.length ? result1.length : 0,
//                     franchises: result2.length ? result2.length : 0
//                 }
//                 res.json({
//                     status: true,
//                     message: "successfully got length",
//                     data: data
//                 });

//             })
//         }
//     })

// })

// //! Partner dashboard api 
// router.post('/get_partner_dashboard', (req, res) => {
//     let body = req.body;

//     connection.query(`SELECT * FROM students WHERE franchises_id=?`, body.franchises_id, function (err, allStudents) {
//         if (err) {
//             res.json({
//                 status: false,
//                 message: err.sqlMessage,
//                 data: []
//             });
//         } else {
//             connection.query(`SELECT * FROM students WHERE is_approved=true AND franchises_id=?`, body.franchises_id, function (err, approve) {
//                 if (err) {
//                     res.json({
//                         status: false,
//                         message: err.sqlMessage,
//                         data: []
//                     });
//                 } else {
//                     connection.query(`SELECT * FROM students WHERE is_approved=false AND franchises_id=?`, body.franchises_id, function (err, disapprove) {
//                         if (err) {
//                             res.json({
//                                 status: false,
//                                 message: err.sqlMessage,
//                                 data: []
//                             });
//                         } else {
//                             connection.query(`SELECT * FROM students WHERE is_exam_attended=true AND franchises_id=?`, body.franchises_id, function (err, testCompletedStudents) {
//                                 let data = {
//                                     total_students: allStudents.length ? allStudents.length : 0,
//                                     approve_students: approve.length ? approve.length : 0,
//                                     disapprove_students: disapprove.length ? disapprove.length : 0,
//                                     test_completed_students: testCompletedStudents.length ? testCompletedStudents.length : 0,

//                                 }
//                                 res.json({
//                                     status: true,
//                                     message: "successfully got length",
//                                     data: data
//                                 });
//                             })
//                         }
//                     })
//                 }


//             })
//         }
//     })

// })

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
            if (result) {
                var student_id = result[0].id;
                student_id = student_id.replace(/[^\d]/g, '');
                if (err) {
                    res.json({
                        status: false,
                        message: err,
                    });
                } else {
                    if (result) {
                        res.json({
                            status: true,
                            message: "got student id",
                            data: parseInt(student_id)
                        });
                    } else {
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


//!pagination new student api
router.post('/pagination_getNew_students', (req, res) => {
    let body = req.body;
    //console.log(body)
    //connection.query('SELECT * FROM students WHERE is_approved IS NULL AND franchises_id=?', body.franchises_id, function (err, result) {
    connection.query('SELECT id, email, password, student_name, surname, address, gender, admission_date, admission_with, birthdate, city, contact_no, course, father_name, father_no, is_approved, pincode, qualification, registration_date, franchises_id, created_at, full_name, is_exam_attended, is_review, is_direct_added FROM students WHERE is_approved IS NULL AND franchises_id=?', body.franchises_id, function (err, result) {

        if (err) {
            console.log('line 472', err)
            res.json({
                status: false,
                message: err,
            });
        } else {
            // if (result) {
            //     const resultsPerPage = 10;
            //     const numOfResults = result.length;
            //     const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            //     let page = req.query.page ? Number(req.query.page) : 1;
            //     if (page > numberOfPages) {
            //         console.log('line 484', err)
            //         res.json({
            //             status: false,
            //             message: "No more data",
            //         });
            //     } else if (page < 1) {
            //         console.log('line 490', err)
            //         res.json({
            //             status: false,
            //             message: "No more data",
            //         });
            //     } else {
            //         const startlingLimit = (page - 1) * resultsPerPage;
            //   sql = `SELECT * FROM students`;
            connection.query(`SELECT id, email, password, student_name, surname, address, gender, admission_date, admission_with, birthdate, city, contact_no, image, course, father_name, father_no, is_approved, pincode, qualification, registration_date, franchises_id, created_at, full_name, is_exam_attended, is_review, is_direct_added FROM students WHERE is_approved IS NULL AND franchises_id=?`, body.franchises_id, function (err, result) {

                if (err) {
                    console.log('line 503', err)
                    res.json({
                        status: false,
                        message: "No more data",
                    });
                } else {
                    // if (result) {
                    //     let iterator = (page - 5) < 1 ? 1 : page - 5;
                    //     let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages);
                    //     if (endingLink < (page + 4)) {
                    //         iterator -= (page + 4) - numberOfPages;
                    //     }
                    // res.render('index',{data:result,page,iterator,endingLink,numberOfPages});
                    res.json({
                        status: true,
                        message: "got",
                        data: result
                    });
                    // }
                }

            })
            //     }
            // }
        }
    })
})

//!pagination approve student api
router.post('/pagination_getApproved_students', (req, res) => {
    let body = req.body;
    //console.log(body)
    //  connection.query('SELECT * FROM students WHERE is_approved=true AND franchises_id=?', body.franchises_id, function (err, result) {
    connection.query(`SELECT id, email, password, student_name, surname, address, gender, admission_date, admission_with, birthdate, city, contact_no, course, father_name, father_no, is_approved, pincode, qualification, registration_date, franchises_id, created_at, full_name, is_exam_attended, is_review, is_direct_added FROM students WHERE is_approved=true AND franchises_id=?`, body.franchises_id, function (err, result) {

        if (err) {
            console.log('line 472', err)
            res.json({
                status: false,
                message: err,
            });
        } else {
            // if (result) {
            //     const resultsPerPage = body.count ? body.count : 5;
            //     const numOfResults = result.length;
            //     const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            //     let page = req.query.page ? Number(req.query.page) : 1;
            //     if (page > numberOfPages) {
            //         console.log('line 484', err)
            //         res.json({
            //             status: false,
            //             message: "No more data",
            //         });
            //     } else if (page < 1) {
            //         console.log('line 490', err)
            //         res.json({
            //             status: false,
            //             message: "No more data",
            //         });
            //     } else {
            //         const startlingLimit = (page - 1) * resultsPerPage;
            //   sql = `SELECT * FROM students`;
            //  connection.query(`SELECT * FROM students WHERE is_approved=true AND franchises_id=?  LIMIT ${startlingLimit},${resultsPerPage}`, body.franchises_id, function (err, result) {
            connection.query(`SELECT id, email, password, student_name, surname, address, gender, image, admission_date, admission_with, birthdate, city, contact_no, course, father_name, father_no, is_approved, pincode, qualification, registration_date, franchises_id, created_at, full_name, is_exam_attended, is_review, is_direct_added FROM students WHERE is_approved=true AND franchises_id=?`, body.franchises_id, function (err, result) {

                if (err) {
                    console.log('line 503', err)
                    res.json({
                        status: false,
                        message: err,
                    });
                } else {
                    // if (result) {
                    //     let iterator = (page - 5) < 1 ? 1 : page - 5;
                    //     let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages);
                    //     if (endingLink < (page + 4)) {
                    //         iterator -= (page + 4) - numberOfPages;
                    //     }
                    // res.render('index',{data:result,page,iterator,endingLink,numberOfPages});
                    res.json({
                        status: true,
                        message: "got",
                        data: result
                    });
                    // }
                }

            })
            // }
            // }
        }
    })
})


//!pagination of disapprove students api

router.post('/pagination_getDisapproved_students', (req, res) => {
    let body = req.body;
    //console.log(body)
    //connection.query('SELECT * FROM students WHERE is_approved=false AND franchises_id=?', body.franchises_id, function (err, result) {
    connection.query('SELECT id, email, password, student_name, surname, address, gender, admission_date, admission_with, birthdate, city, contact_no, course, father_name, father_no, is_approved, pincode, qualification, registration_date, franchises_id, created_at, full_name, is_exam_attended, is_review, is_direct_added FROM students WHERE is_approved=false AND franchises_id=?', body.franchises_id, function (err, result) {
        if (err) {
            console.log('line 472', err)
            res.json({
                status: false,
                message: err,
            });
        } else {
            // if (result) {
            //     const resultsPerPage = 10;
            //     const numOfResults = result.length;
            //     const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            //     let page = req.query.page ? Number(req.query.page) : 1;
            //     if (page > numberOfPages) {
            //         console.log('line 484', err)
            //         res.json({
            //             status: false,
            //             message: "No more data",
            //         });
            //     } else if (page < 1) {
            //         console.log('line 490', err)
            //         res.json({
            //             status: false,
            //             message: "No more data",
            //         });
            //     } else {
            //         const startlingLimit = (page - 1) * resultsPerPage;
            //   sql = `SELECT * FROM students`;
            connection.query(`SELECT id, email, password, student_name, surname, address, gender, admission_date, admission_with, birthdate, city, contact_no, course, father_name, father_no, is_approved, pincode, qualification, registration_date, franchises_id, image, created_at, full_name, is_exam_attended, is_review, is_direct_added FROM students WHERE is_approved=false AND franchises_id=?`, body.franchises_id, function (err, result) {

                if (err) {
                    console.log('line 503', err)
                    res.json({
                        status: false,
                        message: "No more data",
                    });
                } else {
                    // if (result) {
                    //     let iterator = (page - 5) < 1 ? 1 : page - 5;
                    //     let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages);
                    //     if (endingLink < (page + 4)) {
                    //         iterator -= (page + 4) - numberOfPages;
                    //     }
                    // res.render('index',{data:result,page,iterator,endingLink,numberOfPages});
                    res.json({
                        status: true,
                        message: "got",
                        data: result
                    });
                    // }
                }

            })
            //     }
            // }
        }
    })
})

//!test find row length

//! admin dashboard api for show approved students & franchises
router.get('/get_admin_dashboard', (req, res) => {
    let body = req.body;

    connection.query(`SELECT COUNT(id) AS student_count FROM students WHERE  is_approved=true`, function (err, result1) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage,
                data: []
            });
        } else {
            connection.query(`SELECT COUNT(id) AS franchise_count FROM franchises WHERE  isApprove=true AND isDeleted=false`, function (err, result2) {

                let data = {
                    approve_students: result1[0] ? result1[0] : 0,
                    franchises: result2[0] ? result2[0] : 0
                }
                console.log('data is', data)
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

    connection.query(`SELECT COUNT(id) AS all_students FROM students WHERE franchises_id=?`, body.franchises_id, function (err, allStudents) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage,
                data: []
            });
        } else {
            connection.query(`SELECT COUNT(id) AS approved_students FROM students WHERE is_approved=true AND franchises_id=?`, body.franchises_id, function (err, approve) {
                if (err) {
                    res.json({
                        status: false,
                        message: err.sqlMessage,
                        data: []
                    });
                } else {
                    connection.query(`SELECT COUNT(id) AS disapproved_students FROM students WHERE is_approved=false AND franchises_id=?`, body.franchises_id, function (err, disapprove) {
                        if (err) {
                            res.json({
                                status: false,
                                message: err.sqlMessage,
                                data: []
                            });
                        } else {
                            connection.query(`SELECT COUNT(id) AS test_completed_students FROM students WHERE is_exam_attended=true AND franchises_id=?`, body.franchises_id, function (err, testCompletedStudents) {
                                let data = {
                                    total_students: allStudents[0] ? allStudents[0] : 0,
                                    approve_students: approve[0] ? approve[0] : 0,
                                    disapprove_students: disapprove[0] ? disapprove[0] : 0,
                                    test_completed_students: testCompletedStudents[0] ? testCompletedStudents[0] : 0,

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

//! get single student using student id
router.post('/get_single_student', (req, res) => {
    let body = req.body;
    connection.query(`SELECT * FROM students WHERE id = ?`, body.student_id, function (err, result) {
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
                    message: "get single student",
                    data: result[0]
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

//! searchbar api of new student name 
router.post('/search_new_student', (req, res) => {
    let body = req.body;

    connection.query(`SELECT * FROM students WHERE is_approved IS NULL AND student_name LIKE '${body.string}'  AND franchises_id=?  OR id LIKE '${body.string}'  AND is_approved IS NULL `, body.franchise_id, function (err, result) {
        if (err) throw err;
        var data = [];
        // console.log(result)
        for (i = 0; i < result.length; i++) {
            data.push(result[i]);
        }
        res.json({
            status: true,
            message: 'found',
            data: result
        });
    })
})
//! searchbar api of approve student name 
router.post('/search_approved_student', (req, res) => {
    let body = req.body;

    connection.query(`SELECT * FROM students WHERE is_approved=true AND student_name LIKE '${body.string}'  AND franchises_id=?  OR id LIKE '${body.string}'  AND is_approved=true `, body.franchise_id, function (err, result) {
        if (err) throw err;
        var data = [];
        // console.log(result)
        for (i = 0; i < result.length; i++) {
            data.push(result[i]);
        }
        res.json({
            status: true,
            message: 'found',
            data: result
        });
    })
})

//! searchbar api of disapprove student name 
router.post('/search_disapproved_student', (req, res) => {
    let body = req.body;

    connection.query(`SELECT * FROM students WHERE is_approved=false AND student_name LIKE '${body.string}'  AND franchises_id=?  OR id LIKE '${body.string}'  AND is_approved=false `, body.franchise_id, function (err, result) {
        if (err) throw err;
        var data = [];
        // console.log(result)
        for (i = 0; i < result.length; i++) {
            data.push(result[i]);
        }
        res.json({
            status: true,
            message: 'found',
            data: result
        });
    })
})

//! searchbar api of test result students 
router.post('/search_test_result', (req, res) => {
    let body = req.body;

    connection.query(`SELECT * FROM students WHERE is_exam_attended=true AND student_name LIKE '${body.string}'  AND franchises_id=?  OR id LIKE '${body.string}'  AND is_exam_attended=true `, body.franchise_id, function (err, result) {
        if (err) throw err;
        var data = [];
        // console.log(result)
        for (i = 0; i < result.length; i++) {
            data.push(result[i]);
        }
        res.json({
            status: true,
            message: 'found',
            data: result
        });
    })
})

//! get new students by all franchises
router.get('/pagination_getNew_students_byAll_franchises', (req, res) => {
    let body = req.body;
    //console.log(body)
    connection.query('SELECT * FROM students WHERE is_approved IS NULL', function (err, result) {
        // connection.query('SELECT id, email, password, student_name, surname, address, gender, admission_date, admission_with, birthdate, city, contact_no, course, father_name, father_no, is_approved, pincode, qualification, registration_date, franchises_id, created_at, full_name, is_exam_attended, is_review, is_direct_added FROM students WHERE is_approved IS NULL', function (err, result) {

        if (err) {
            console.log('line 472', err)
            res.json({
                status: false,
                message: err,
            });
        } else {
            // if (result) {
            //     const resultsPerPage = 10;
            //     const numOfResults = result.length;
            //     const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            //     let page = req.query.page ? Number(req.query.page) : 1;
            //     if (page > numberOfPages) {
            //         console.log('line 484', err)
            //         res.json({
            //             status: false,
            //             message: "No more data",
            //         });
            //     } else if (page < 1) {
            //         console.log('line 490', err)
            //         res.json({
            //             status: false,
            //             message: "No more data",
            //         });
            //     } else {
            //         const startlingLimit = (page - 1) * resultsPerPage;
            //   sql = `SELECT * FROM students`;
            connection.query(`SELECT * FROM students WHERE is_approved IS NULL`, function (err, result) {

                if (err) {
                    console.log('line 503', err)
                    res.json({
                        status: false,
                        message: "No more data",
                    });
                } else {
                    // if (result) {
                    //     let iterator = (page - 5) < 1 ? 1 : page - 5;
                    //     let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages);
                    //     if (endingLink < (page + 4)) {
                    //         iterator -= (page + 4) - numberOfPages;
                    //     }
                    // res.render('index',{data:result,page,iterator,endingLink,numberOfPages});
                    res.json({
                        status: true,
                        message: "got",
                        data: result
                    });
                    // }
                }

            })
            //     }
            // }
        }
    })
})

module.exports = router;