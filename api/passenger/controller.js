// Import necessary modules and functions
const {
  getPassengerList,
  getPassengerGroup,
  createSchedule,
  getPassengerListGroupById,
  getBulletinAnnouncement,
  getBulletinHoliday,
  updateBulletinAnnouncement,
  getBoardedPassengersBySchedule,
  createOrUpdatePassengerBySchedule,
  getScheduleSummaryReport,
  getScheduleByPassenger,
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
  getPassengerList: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await getPassengerList(body);
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

  getPassengerGroup: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await getPassengerGroup(body);
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

  createSchedule: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await createSchedule(body);
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

  getPassengerListGroupById: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await getPassengerListGroupById(body);
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

  getBulletinAnnouncement: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await getBulletinAnnouncement(body);
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

  getBulletinHoliday: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await getBulletinHoliday(body);
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

  updateBulletinAnnouncement: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await updateBulletinAnnouncement(body);
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

  /**
   * Get boarded passengers by schedule
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   */
  getBoardedPassengersBySchedule: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await getBoardedPassengersBySchedule(body);
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

  createOrUpdatePassengerBySchedule: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await createOrUpdatePassengerBySchedule(body);
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

  getScheduleByPassenger: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await getScheduleByPassenger(body);
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

  getScheduleSummaryReport: async (req, res) => {
    if (req.body) {
      try {
        const body = req.body;
        const result = await getScheduleSummaryReport(body);
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
