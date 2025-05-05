const router = require("express").Router();
const Joi = require('joi');
const { getPassengerList, getPassengerGroup, createSchedule, getPassengerListGroupById, getBulletinAnnouncement, getBulletinHoliday, updateBulletinAnnouncement } = require("./controller");


router.post("/getPassengerList", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            admin_username: Joi.string().max(50).required(),
            date: Joi.string().max(50).required()
        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        getPassengerList({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

router.post("/getPassengerGroup", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            admin_username: Joi.string().max(50).required(),
        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        getPassengerGroup({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

router.post("/createNewSchedule", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            admin_username: Joi.string().max(50).required(),
            morning_pickup: Joi.string().required(),
            post_work_dropoff: Joi.string().required(),
            driver: Joi.string().required(),
            shuttle: Joi.string().required(),
            date: Joi.date().required(),
            passenger_group_id: Joi.number().integer().required()
        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        createSchedule({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

router.post("/getPassengerListGroupById", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            passenger_group_id: Joi.number().integer().required()
        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        getPassengerListGroupById({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

router.post("/getBulletinAnnouncement", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            admin_username: Joi.string().max(50).required(),
            date: Joi.string().required()
        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        getBulletinAnnouncement({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

router.post("/getBulletinHoliday", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            admin_username: Joi.string().max(50).required()
        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        getBulletinHoliday({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

router.post("/updateBulletinAnnouncement", async (req, res, next) => {
    try {
        const { error, value } = await Joi.object({
            admin_username: Joi.string().max(50).required(),
            announcement: Joi.string().max(255).required()
        }).validate(req.body);

        // If there is a validation error, return a 400 Bad Request response with error details
        if (error) {
            return res.status(400).json({ errors: error.details });
        }

        updateBulletinAnnouncement({ ...req, body: value }, res);
    } catch (err) {
        console.log('Validation Error:', err);
    }
});

module.exports = router;