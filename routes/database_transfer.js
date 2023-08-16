const express = require('express');
const router = express.Router();
var connection = require('../config/db.config');

//!add franchises api firebase to mysql
router.post('/add_franchises', (req, res) => {
    let body = req.body;
    body.forEach(franchise => {
        connection.query(`INSERT INTO franchises SET ?`, franchise, function (err, result) {

        })
    });
    res.json({
        status: true,
        message: "franchises Added Successfully to mysql",
    });


})
//!add  students api firebase to mysql
router.post('/add_students', (req, res) => {
    let body = req.body;

    connection.query(`SELECT * FROM results WHERE franchises_id = '${body.franchise_id}'`, function (err, result) {
        if (err) {
            res.json({
                status: false,
                message: err,
            });
        };

        if (result) {
            res.json({
                status: true,
                message: "students Added Successfully to mysql",
            });
        }
    });
})

//!add  student's  exam details in results table api firebase to mysql

router.post('/change_studentsFlag', (req, res) => {
    let body = req.body;

    connection.query(`SELECT student_id FROM results where franchises_id = '${body.franchise_id}'`, function (err, result) {
        if(err){
            res.json({
                status: false,
                message: err,
            });
        }else{
            if(result.length){
                result.forEach(student => {
                    console.log(student.student_id)
                    connection.query(`UPDATE students SET is_direct_added=true, is_review = true,is_exam_attended=true WHERE id = ?`,student.student_id, function (err, result) {
                      if(err){
                        res.json({
                            status: false,
                            message: err,
                        });
                      }
                    })
                    
                })
                res.json({
                    status: true,
                    message: "flag change",
                    data:result
                });
            }
        }
    })

})
module.exports = router;