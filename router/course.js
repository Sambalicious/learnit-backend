const {
  getAllCourses,
  getCourseById,
  createCourse,
  editCourse,
  deleteCourse,
} = require("../controller/course");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

const router = require("express").Router();

router.get("/", getAllCourses);
router.post("/", createCourse);
router.put("/:id", [auth, admin], editCourse);
router.get("/:id", getCourseById);
router.delete("/:id", [auth, admin], deleteCourse);

module.exports = router;
