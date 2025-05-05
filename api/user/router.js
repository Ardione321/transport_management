const router = require("express").Router();
const Joi = require('joi');
const { loginUser, registerUser, addBulletinMessage, getAllDriver, updateDriverByDriverName, getAllPassenger, updatePassengerByUserName, getPassengerByUserName, getDriverByUserName } = require("./controller");


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
            mobile_number: Joi.string().max(50).required(),
            email_add: Joi.string().max(50).required(),
            pickup_dropoff_id: Joi.number().max(11).required(),
            passenger_group_id: Joi.number().max(11).required()

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

router.post("/addBulletinMessage", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            admin_username: Joi.string().max(50).required(),
            holiday: Joi.string().max(5000).optional().allow(""),
            announcement: Joi.string().max(5000).optional().allow(""),

        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        addBulletinMessage({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

router.post("/getAllDriver", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            admin_username: Joi.string().max(50).required(),

        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        await getAllDriver({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

router.post("/updateDriverByDriverName", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            admin_username: Joi.string().max(50).required(),
            username: Joi.string().max(50).required(),
            first_name: Joi.string().max(50).required(),
            last_name: Joi.string().max(50).required(),
            mobile_number: Joi.number().required(),
            email_add: Joi.string().max(255).required(),
            pickup_dropoff_id: Joi.number().max(50).required()

        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        await updateDriverByDriverName({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

router.post("/updatePassengerByUserName", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            admin_username: Joi.string().max(50).required(),
            username: Joi.string().max(50).required(),
            first_name: Joi.string().max(50).required(),
            last_name: Joi.string().max(50).required(),
            mobile_number: Joi.number().required(),
            email_add: Joi.string().max(255).required(),
            passenger_group_id: Joi.number().max(50).required()

        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        await updatePassengerByUserName({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

router.post("/getAllPassenger", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            admin_username: Joi.string().max(50).required(),

        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        await getAllPassenger({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

router.post("/getPassengerByUserName", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            username: Joi.string().max(50).required(),

        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        await getPassengerByUserName({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

router.post("/getDriverByUserName", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            username: Joi.string().max(50).required(),

        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        await getDriverByUserName({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

module.exports = router;