const Joi = require("joi");
const { asyncMiddleware } = require("../middleware/AsyncMiddleware");
const { Course, User, Comment } = require("../models");
const { apiResponse } = require("../utils/apiResponse");

const validateComment = (body) => {
  const schema = Joi.object({
    Body: Joi.string().required(),
    UserId: Joi.string().required(),
    CourseId: Joi.string().required,
  });
  return schema.validate(body);
};

exports.addComment = asyncMiddleware(async (req, res) => {
  let { courseId } = req.params;
  console.log("courseId params", req.params);
  let { Body, UserId } = req.body;

  let { error } = validateComment(req.body);

  if (error) {
    return res
      .status(400)
      .json(apiResponse({ code: 400, errorMessage: error.details[0].message }));
  }

  let course = await Course.findOne({ where: { id: courseId } });

  if (!course) {
    return res
      .status(404)
      .json(
        apiResponse({ code: 400, errorMessage: "This course does not exist" })
      );
  }

  let user = await User.findOne({ where: { UserId } });

  if (!user) {
    return res
      .status(404)
      .json(
        apiResponse({ code: 404, errorMessage: "This user does not exist" })
      );
  }

  let comment = await Comment.create({ Body, userId: user.id });

  await course.addComment(comment);

  return res
    .status(200)
    .json(
      apiResponse({ code: 200, data: "Your post has been added successfully" })
    );
});

exports.getComments = asyncMiddleware(async (req, res) => {
  let { courseId } = req.params;

  let course = await Course.findOne({
    where: { id: courseId },
    include: ["comments"],
  });

  if (!course) {
    return res
      .status(404)
      .json(
        apiResponse({ code: 404, errorMessage: "This course does not exist" })
      );
  }

  res.status(200).json(apiResponse({ code: 200, data: { Course: course } }));
});
