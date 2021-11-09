const { createUser, editUser } = require("../controller/user");


const router = require("express").Router();


router.post("/", createUser);
router.put("/", editUser);



module.exports =router