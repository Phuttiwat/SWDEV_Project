const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

//Load env vars
dotenv.config({path:'./config/config.env'});

//Route file
const hospitals = require('./routes/hospitals');
const appointments = require('./routes/appointments');
const auth = require('./routes/auth');

//Connect to database
connectDB();

const app=express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//add url path
app.use('/api/v1/hospitals',hospitals);
app.use('/api/v1/appointments',appointments)
app.use('/api/v1/auth',auth);

//Running server
const PORT=process.env.PORT || 5000;
const server = app.listen(PORT,console.log('Server running in', process.env.NODE_ENV,'mode on port',PORT))

//Handle unhandled promise rejections
process.on('unhandleRejection',(err,promise)=>{
    console.log(`Error${err.message}`);
    //Close server & exit process
    server.close(()=>process.exit(1));
});
