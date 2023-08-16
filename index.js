const functions = require("firebase-functions");

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
        status:true,
        message:'API working fine.'
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

app.use('/api/banner',require('./routes/banner'));

app.use('/api/gallery',require('./routes/gallery'));

app.use('/api/inquiry_franchises',require('./routes/inquiry_franchises'));


app.use('/api/inquiry_students',require('./routes/inquiry_students'));

app.use('/api/database_transfer',require('./routes/database_transfer'));



//exports.app = functions.https.onRequest(app);
/* app.listen(1000, () => {
    console.log("Now listening on port 1000");
});
 */

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});