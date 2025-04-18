const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require('cors');
const mongoSanitize=require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp')
//Load env vars
dotenv.config({path:'./config/config.env'});

//Route file
const companies = require('./routes/companies');
const bookings = require('./routes/bookings');
const auth = require('./routes/auth');
const feedbacks = require('./routes/feedbacks');

//Connect to database
connectDB();

const app = express();

app.use(cors());
//Body parser
app.use(express.json());
//Sanatize data
app.use(mongoSanitize());
//Set security header
app.use(helmet());
//Prevent XSS attacks
app.use(xss());
//Rate Limiting
const limiter = rateLimit({
    windowsMS:10*60*1000,//10 mins
    max:100
})
app.use(limiter);
//Prevent http param pollutions
app.use(hpp());
//Cookie parser
app.use(cookieParser());

//add url path
app.use('/api/v1/companies',companies);
app.use('/api/v1/bookings',bookings)
app.use('/api/v1/auth',auth);
app.use('/api/v1/feedbacks',feedbacks);

//Running server
const PORT=process.env.PORT || 5000;
const server = app.listen(PORT,console.log('Server running in', process.env.NODE_ENV,'mode on port',PORT))

//Handle unhandled promise rejections
process.on('unhandleRejection',(err,promise)=>{
    console.log(`Error${err.message}`);
    //Close server & exit process
    server.close(()=>process.exit(1));
});
