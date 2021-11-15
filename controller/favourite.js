const Joi = require("joi");
const { asyncMiddleware } = require("../middleware/AsyncMiddleware");
const { apiResponse } = require("../utils/apiResponse");
const { Favorite, User, Course } = require("../models");
const validateFavorite = (body) => {
  const schema = Joi.object({
    UserId: Joi.string().required(),
    CourseId: Joi.number().required(),
  });

  return schema.validate(body);
};

exports.addToFavorite = asyncMiddleware(async (req, res) => {
  let { CourseId, UserId } = req.body;
  let { error } = validateFavorite(req.body);

  if (error) {
    return res
      .status(400)
      .json(apiResponse({ code: 400, errorMessage: error.details[0].message }));
  }

  let course = await Course.findOne({ where: { id: CourseId } });

  if (!course) {
    return res
      .status(404)
      .json(
        apiResponse({ code: 404, errorMessage: "This course is not available" })
      );
  }

  //   if (course) {
  //     return res.status(400).json(
  //       apiResponse({
  //         code: 400,
  //         errorMessage: "You have already enrolled for this course.",
  //       })
  //     );
  //   }

  let user = await User.findOne({ where: { UserId } });

  if (!user) {
    return res
      .status(404)
      .json(
        apiResponse({ code: 404, errorMessage: "This user does not exist" })
      );
  }

  let favorite = await Favorite.create({
    userId: user.id,
    courseId: course.id,
  });

  await course.addFavorite(favorite);

  return res.status(200).json(
    apiResponse({
      code: 200,
      data: "This course has been added to your favorite",
    })
  );
});

exports.getFavorites = asyncMiddleware(async (req, res) => {
  let favorites = await User.findAll({
    include: ["favorites"],
    exclude: ["Favorite_Course"],
  });

  return res
    .status(200)
    .json(apiResponse({ code: 200, data: { Favorite: favorites } }));
});
