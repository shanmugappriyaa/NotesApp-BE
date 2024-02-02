const express =require('express')
const router = express.Router()
const newLocal = '../controller/usercontroller'
const userControl = require(newLocal)

router.post('/login',userControl.loginUser)
router.post('/register',userControl.registerUser)
router.get('/profile',userControl.profile)
router.post('/logout',userControl.logout)


module.exports =router
