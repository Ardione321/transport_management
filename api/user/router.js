const router = require("express").Router();
const Joi = require('joi');
const { loginUser, registerUser } = require("./controller");

/**
 * Route: POST /api/login
 * Description: Handles user login.
 * Validates the request body, authenticates the user, and returns tokens.
 */
router.post("/login", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            username: Joi.string().max(50).required(),
            password: Joi.string().max(50).required()
        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        loginUser({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

router.post("/register", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            admin_username: Joi.string().max(50).required(),
            first_name: Joi.string().max(50).required(),
            last_name: Joi.string().max(50).required(),
            username: Joi.string().max(50).required(),
            password: Joi.string().max(50).required(),
            user_role: Joi.number().max(50).required(),

        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        registerUser({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

module.exports = router;