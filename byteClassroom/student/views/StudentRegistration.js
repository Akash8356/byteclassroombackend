const express = require('express')
const route = express.Router()

const StudentRegistration = require('./../controllers/StudentRegistration')

route.post('/register',StudentRegistration.RegisterStudent)
route.post('/login',StudentRegistration.LoginStudent)

module.exports = route