const express=require ("express");
const {signUpUser,signInUser,findUser,getInfo}=require("../Controllers/userController");
const { authmiddleware } = require("../Middelware/Auth");
const router=express.Router();



router.post('/signup',signUpUser)

router.post('/signin',signInUser)

router.get('/finduser',findUser)

router.get('/info',authmiddleware,getInfo)



module.exports = router;