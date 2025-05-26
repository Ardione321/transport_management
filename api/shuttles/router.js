const router = require("express").Router();
const Joi = require("joi");
const {
  selectAllShuttles,
  registerShuttles,
  updateShuttle,
} = require("./controller");

/**
 * Route: POST /api/login
 * Description: Handles user login.
 * Validates the request body, authenticates the user, and returns tokens.
 */
router.post("/selectAllShuttles", async (req, res, next) => {
  try {
    const { error, value } = await Joi.object({
      admin_username: Joi.string().max(50).required(),
    }).validate(req.body);

    // If there is a validation error, return a 400 Bad Request response with error details
    if (error) {
      return res.status(400).json({ errors: error.details });
    }

    selectAllShuttles({ ...req, body: value }, res);
  } catch (err) {
    console.log("Validation Error:", err);
  }
});

router.post("/registerShuttles", async (req, res, next) => {
  try {
    const { error, value } = await Joi.object({
      admin_username: Joi.string().max(50).required(),
      name: Joi.string().max(50).required(),
      model: Joi.string().max(50).required(),
      plate_number: Joi.string().max(50).required(),
      color: Joi.string().max(50).required(),
      siting_capacity: Joi.string().max(50).required(),
      coding: Joi.string().max(50).required(),
    }).validate(req.body);

    // If there is a validation error, return a 400 Bad Request response with error details
    if (error) {
      return res.status(400).json({ errors: error.details });
    }

    registerShuttles({ ...req, body: value }, res);
  } catch (err) {
    console.log("Validation Error:", err);
  }
});

router.post("/updateShuttles", async (req, res, next) => {
  try {
    const { error, value } = await Joi.object({
      admin_username: Joi.string().max(50).required(),
      name: Joi.string().max(50).required(),
      model: Joi.string().max(50).required(),
      plate_number: Joi.string().max(50).required(),
      color: Joi.string().max(50).required(),
      siting_capacity: Joi.string().max(50).required(),
      coding: Joi.string().max(50).required(),
    }).validate(req.body);

    // If there is a validation error, return a 400 Bad Request response with error details
    if (error) {
      return res.status(400).json({ errors: error.details });
    }

    updateShuttle({ ...req, body: value }, res);
  } catch (err) {
    console.log("Validation Error:", err);
  }
});
module.exports = router;
