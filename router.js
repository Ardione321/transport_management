const router = require("express").Router();
const Joi = require('joi');
const { loginUser, verifyRefresh } = require("./api/user/controller");

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

module.exports = router;