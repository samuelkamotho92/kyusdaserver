const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const memberRoute = require('./Router/authRoute');
const departmentRoute = require('./Router/departMentRoute');
const app = express();
app.use(express.json());
app.use(cors({
    origin:'https://kyusdaapi.azurewebsites.net', 
    credentials:true
}))

app.use('/kyusda/v1/member/',memberRoute);
app.use('/kyusda/v1/departments/',departmentRoute);
module.exports = app