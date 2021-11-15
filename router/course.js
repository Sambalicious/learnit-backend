const { getComments, addComment } = require("../controller/comment");
const {
  getAllCourses,
  getCourseById,
  createCourse,
  editCourse,
  deleteCourse,
} = require("../controller/course");
const { addToFavorite, getFavorites } = require("../controller/favourite");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

const router = require("express").Router();

router.get("/", getAllCourses);
router.post("/", createCourse);
router.put("/:id", [auth, admin], editCourse);
router.get("/:id", getCourseById);
router.delete("/:id", [auth, admin], deleteCourse);

//comments

router.post("/:courseId/comments", addComment);

router.get("/:courseId/comments", getComments);

//favorite

router.post("/favorite", addToFavorite);
router.get("/favorite", getFavorites);

module.exports = router;
