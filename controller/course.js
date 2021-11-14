const Joi = require("joi");
const { asyncMiddleware } = require("../middleware/AsyncMiddleware");
const { apiResponse } = require("../utils/apiResponse");

const { Course, User } = require("../models");
const validateCourse = (body) => {
  const schema = Joi.object({
    Title: Joi.string().required().min(3),
    Description: Joi.string().required(),
    Body: Joi.string().optional(),
    ImageUrl: Joi.string().required(),
    VideoUrl: Joi.string().required(),
    UserId: Joi.string().required(),
  });

  return schema.validate(body);
};

exports.createCourse = asyncMiddleware(async (req, res) => {
  let { Title, Description, Body, ImageUrl, VideoUrl, UserId } = req.body;

  let { error } = validateCourse(req.body);

  if (error) {
    return res
      .status(400)
      .json(apiResponse({ code: 400, errorMessage: error.details[0].message }));
  }

  let course = await Course.findOne({ where: { Title } });

  if (course) {
    return res.status(400).json(
      apiResponse({
        code: 400,
        errorMessage: "A course with this title already exist.",
      })
    );
  }

  let user = await User.findOne({ where: { UserId } });

  if (!user) {
    return res
      .status(404)
      .json(
        apiResponse({ code: 404, errorMessage: "This user doesn't exist" })
      );
  }

  course = await Course.create({
    Title,
    Description,
    Body,
    ImageUrl,
    VideoUrl,
    userId: user.id,
  });

  return res
    .status(200)
    .json(apiResponse({ code: 200, data: { Course: course } }));
});

exports.getAllCourses = asyncMiddleware(async (req, res) => {
  let courses = await Course.findAll({ include: ["comments"] });

  return res.status(200).json(apiResponse({ code: 200, data: courses }));
});

exports.getCourseById = asyncMiddleware(async (req, res) => {
  let { id } = req.params;

  let course = await Course.findOne({ where: { id } });

  if (!course) {
    return res.status(404).json(
      apiResponse({
        code: 404,
        errorMessage: `Course with Id: ${id} does not exist`,
      })
    );
  }

  return res
    .status(200)
    .json(apiResponse({ code: 200, data: { Course: course } }));
});

exports.editCourse = asyncMiddleware(async (req, res) => {
  let { Title, Description, ImageUrl, VideoUrl, Body } = req.body;
  let { id } = req.params;
  let { error } = validateCourse(req.body);

  if (error) {
    return res
      .status(400)
      .json(apiResponse({ code: 400, errorMessage: error.details[0].message }));
  }

  let course = await Course.findOne({ where: { id } });

  if (!course) {
    return res.status(404).json(
      apiResponse({
        code: 404,
        errorMessage: `Course with Id: ${id} does not exist`,
      })
    );
  }

  (course.Body = Body),
    (course.Description = Description),
    (course.Title = Title),
    (course.ImageUrl = ImageUrl);
  course.VideoUrl = VideoUrl;

  await course.save();

  return res
    .status(200)
    .json(apiResponse({ code: 200, data: { Course: course } }));
});

exports.deleteCourse = asyncMiddleware(async (req, res) => {
  let { id } = req.params;

  let course = await Course.findOne({ where: { id } });

  if (!course) {
    return res.status(404).json(
      apiResponse({
        code: 404,
        errorMessage: `Course with Id: ${id} does not exist`,
      })
    );
  }

  await course.destroy();

  return res
    .status(200)
    .json(
      apiResponse({ code: 200, data: `Course with Id: ${id} has been deleted` })
    );
});








