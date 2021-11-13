const { assignRole, createRole, getUsers } = require("../controller/admin");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

const router = require("express").Router();

router.post("/assignRole", [auth, admin], assignRole);

router.post("/createRole", createRole);
router.get("/users",  getUsers);

module.exports = router;
