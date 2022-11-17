const express = require('express');
const departmentDetail = require('../Controlers/departmentControler');
const departDetail = express.Router();
departDetail
.route("/getDetails")
.post(departmentDetail.getDepartmentDetails)

module.exports = departDetail