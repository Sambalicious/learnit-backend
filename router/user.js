const { createUser } = require("../controller/user");


const router = require("express").Router();


router.post("/", createUser)



module.exports =router