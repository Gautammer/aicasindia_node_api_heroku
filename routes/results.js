const express = require('express');
const router = express.Router();
var connection = require('../config/db.config');

//!get Practical mark from result table 

router.post('/get_result', (req, res) => {
    let body = req.body;
    connection.query(`SELECT * FROM results WHERE  student_id = ?`, body.student_id, function (err, result) {
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
                    message: "get result table data",
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
    });

})

//!update result
router.post('/update_result', (req, res) => {
    let body = req.body;
    connection.query(`UPDATE results SET ? WHERE student_id = '${body.student_id} '`, body, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        } else {
            if (result) {

                connection.query(`UPDATE students SET is_review = true WHERE id = '${body.student_id}'`, function (err, result) {

                });


                res.json({
                    status: true,
                    message: "updated",
                    result: result
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

//!direct added student in result page api

router.post('/directAdded_result', (req, res) => {
    let body = req.body;
    connection.query(`SELECT * FROM RESULTS WHERE student_id = '${body.student_id}'`, function (err, result) {
        if (err) {
            res.json({
                message: err.message,
                status: false,
            });
        } else {
            if (result.length) {
                connection.query(`UPDATE RESULTS SET ? WHERE student_id = '${body.student_id}'`,body, function (err, result) {
                    if (err) {
                        res.json({
                            message: err.message,
                            status: false,

                        });
                    } else {
                        if (result) {
                            connection.query(`UPDATE students SET is_direct_added=true, is_review = true,is_exam_attended=true WHERE id = '${body.student_id}'`, function (err, result) {
                            })
                            res.json({
                                status: true,
                                message: "successfully update",
                               // data: data
                            });
                        }
                    }
                })

            } else {
                connection.query(`INSERT INTO results SET ? `, body, function (err, result) {
                    if (err) {
                        res.json({
                            message: err.message,
                            status: false,

                        });
                    }else{
                        if(result){
                            connection.query(`UPDATE students SET is_direct_added=true, is_review = true,is_exam_attended=true WHERE id = '${body.student_id}'`, function (err, result) {
                                
                                res.json({
                                    status: true,
                                    message: "successfully updated",
                                    //data: result
                                });
                            })
                        }
                    } 
                })

            }

        }
    })


})


module.exports = router;