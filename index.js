const express = require("express");
const app = express();
const bodyParser = require('express');




var connection = require('./config/db.config');
//!header include for CORS Error
const cors = require('cors');
app.use(cors({
    origin: "*"
}));
//!header close


app.get('/',(req,res)=>{
  
    res.json({
        status:true
    });
});


// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
}))




app.use('/api/admin',require('./routes/admin'));


app.use('/api/franchises',require('./routes/franchises'));


app.use('/api/students',require('./routes/students'));


app.use('/api/materials',require('./routes/materials'));


app.use('/api/questions',require('./routes/questions'));

app.use('/api/answers',require('./routes/answers'));

app.use('/api/results',require('./routes/results'));

app.use('/api/inquiry_franchises',require('./routes/inquiry_franchises'));


app.use('/api/inquiry_students',require('./routes/inquiry_students'));

app.use('/api/database_transfer',require('./routes/database_transfer'));


module.exports = app;

/* 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
}); */