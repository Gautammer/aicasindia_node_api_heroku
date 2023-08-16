const express = require('express');
const router = express.Router();
var connection = require('../config/db.config');

//!answers add api
router.post('/add_answers', (req, res) => {
    let body = req.body;
    body.forEach(question => {
        connection.query(`INSERT INTO answers SET ?`, question, function (err, result) {

        })
    });
    res.json({
        status: true,
        message: "answers Added Successfully",
    });
})

// //!get Answer


router.post('/generate_practical_mark', (req, res) => {
    let body = req.body;
    //console.log(body)
    connection.query(`SELECT * FROM results WHERE student_id = ?`, body.student_id, function (err, result) {

        if (result.length) {
            // data is already available
            res.json({
                status: true,
                message: "practical mark fetched successfully",
                data: result[0]
            });
        } else {

            connection.query(`SELECT * FROM answers WHERE student_id='${body.student_id}'`, function(err,marks){
                let practical_mark = 0;
                marks.forEach(student => {
        
                    if (student.answer == student.selected_answer) {
                        practical_mark++;
        
                    } else {
        
                    }
                });
                //!insert practical mark in result table
                let data = {
                    practical_mark: practical_mark,
                    franchises_id: marks[0].franchises_id,
                    student_id: marks[0].student_id,
                    created_at: new Date()
                }

                connection.query(`INSERT INTO results SET ? `,data,function (err,result){
                    if(err){
                        res.json({
                            status:false,
                            message:"Cannot insert",
                            data:{}
                        });
                    }else{
                        res.json({
                            message:"Success",
                            status:true,
                            data:data
                        });
                    }
                });
            });

            // data not available
        }

       
    });




})




module.exports = router;