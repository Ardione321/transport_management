// Import necessary modules and functions
const { loginUser, registerUser } = require("./service");
const {
    sendErrorResponse,
    sendSuccessfulResponse,
    sendBadRequestResponse
} = require("../../utils/response");

/**
 * Controller functions for user authentication and token management.
 */
module.exports = {
    loginUser: async (req, res) => {
        if (req.body) {
            try {
                const body = req.body;
                const result = await loginUser(body);
                // Send a successful response
                return sendSuccessfulResponse(req, res, result, true);
            } catch (e) {
                // Handle and send an error response in case of an error
                return sendErrorResponse(e, req, res);
            }
        } else {
            // Send a bad request response if the request body is missing
            return sendBadRequestResponse(res);
        }
    },

    registerUser: async (req, res) => {
        if (req.body) {
            try {
                const body = req.body;
                const result = await registerUser(body);
                // Send a successful response
                return sendSuccessfulResponse(req, res, result, true);
            } catch (e) {
                // Handle and send an error response in case of an error
                return sendErrorResponse(e, req, res);
            }
        } else {
            // Send a bad request response if the request body is missing
            return sendBadRequestResponse(res);
        }
    },
};