const { editRole, createRole, getUsers } = require("../controller/admin");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

const router = require("express").Router();

router.post("/user", [auth, admin], editRole);

router.post("/user/role", [auth, admin], createRole);
router.get("/users", [auth, admin], getUsers);

module.exports = router;
