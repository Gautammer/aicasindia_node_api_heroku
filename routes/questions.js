const express = require('express');
const router = express.Router();
var connection = require('../config/db.config');


//!Add Question api
// router.post('/add_question', (req, res) => {
//     let body = req.body;

//     connection.query('INSERT INTO questions SET ?', body, function (err, result) {
//         if (err) {
//             res.json({
//                 status: false,
//                 message: err.sqlMessage
//             });
//         }
//         else {

//             if (result) {
//                 res.json({
//                     status: true,
//                     message: "Question added successfully",
//                     data: result
//                 });
//             } else {
//                 res.json({
//                     status: false,
//                     message: err.sqlMessage,
//                     data: []
//                 });
//             }

//         }

//     })
// })

router.post('/add_question', (req, res) => {
    let body = req.body;

    connection.query(`SELECT * FROM questions WHERE question_id  = '${body.question_id}' AND language ='${body.language}'`, function (err, result) {

        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        }
        else {

            if (result.length) {
                res.json({
                    status: false,
                    message: 'Question id already added.',
                   // data: result
                });
            } else {
                connection.query('INSERT INTO questions SET ?', body, function (err, result) {
                    if (err) {
                        res.json({
                            status: false,
                            message: err.sqlMessage
                        });
                    }
                    else {

                        if (result.affectedRows) {
                            res.json({
                                status: true,
                                message: "Question added successfully",
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
            }

        }

    })
})

//!Get Questions by its language
router.post('/get_question', (req, res) => {
    let body = req.body;
    connection.query(`SELECT * FROM questions WHERE language = ?`, body.language, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        } else {
            if (result) {
                res.json({
                    status: true,
                    message: "get questions",
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

//!edit question(update)
router.post('/update_question', (req, res) => {
    let body = req.body;
    connection.query(`UPDATE questions SET ? WHERE id = ${body.id} `, body, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err.sqlMessage
            });
        } else {
            if (result) {
                res.json({
                    status: true,
                    message: "question updated"
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

//!delete question
router.post('/delete_question', (req, res) => {
    let body = req.body;
    //console.log(body)
    connection.query(`DELETE FROM questions  WHERE id = ${body.id} `, body.id, function (err, result) {
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
                    message: "question deleted"
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