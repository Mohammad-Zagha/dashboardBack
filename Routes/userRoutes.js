const {userLogin,userSignup, userLogout,loggedIn} = require('../controlls/userControlls')
const express = require('express')
const router=express.Router();

router.post('/login',userLogin)
router.post('/signup',userSignup)
router.post('/logout',userLogout)
router.get('/LoggedIn',loggedIn)
module.exports = router