const { getComments, addComment } = require("../controller/comment");
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

router.post("/:courseId/comments", addComment);
router.get("/:courseId/comments", getComments);

module.exports = router;
