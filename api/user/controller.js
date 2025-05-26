// Import necessary modules and functions
const {
  loginUser,
  registerUser,
  addBulletinMessage,
  getAllDriver,
  updateDriverByDriverName,
  getAllPassenger,
  updatePassengerByUserName,
  getDriverByUserName,
  getPassengerByUserName,
} = require("./service");
const {
  sendErrorResponse,
  sendSuccessfulResponse,
  sendBadRequestResponse,
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

  addBulletinMessage: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await addBulletinMessage(body);
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

  getAllDriver: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await getAllDriver(body);
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

  updateDriverByDriverName: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await updateDriverByDriverName(body);
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

  getAllPassenger: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await getAllPassenger(body);
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

  updatePassengerByUserName: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await updatePassengerByUserName(body);
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

  getDriverByUserName: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await getDriverByUserName(body);
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

  getPassengerByUserName: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await getPassengerByUserName(body);
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
