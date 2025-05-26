// Import necessary modules and models
const { User, UserRoles } = require("../../models");

// Initialize the database utility
let dbUtil = null;

/**
 * Initialize the database utility with the provided instance.
 *
 * @param {object} dbUtilInstance - The database utility instance.
 */
module.exports = {
  init: (dbUtilInstance) => {
    dbUtil = dbUtilInstance;
  },

  /**
   * Retrieve a user role by its ID.
   *
   * @param {number} roleId - The ID of the user role to retrieve.
   * @returns {Promise<Object>} - The user role data.
   * @throws {Error} - If the user role is not found.
   */
  getUserRoleById: async (roleId) => {
    try {
      // Query the database to find a user role by ID
      const result = await UserRoles.findOne({
        where: { id: roleId },
      });

      // If no result is found, throw an error
      if (!result) {
        throw new Error("Role not found.");
      }

      // Return the data values of the found user role
      return result.dataValues;
    } catch (error) {
      throw error; // Rethrow any caught errors
    }
  },

  /**
   * Retrieve a user by their user ID.
   *
   * @param {number} userId - The ID of the user to retrieve.
   * @returns {Promise<Object>} - The user data.
   * @throws {Error} - If the user is not found.
   */
  getUserByUserId: async (userId) => {
    try {
      // Query the database to find a user by ID
      const result = await User.findOne({
        attributes: ["username", "user_role"],
        where: { id: userId },
      });

      // If no result is found, throw an error
      if (!result) {
        throw new Error("User not found.");
      }

      // Return the data values of the found user
      return result.dataValues;
    } catch (error) {
      throw error; // Rethrow any caught errors
    }
  },

  checkUserIFAdmin: async (username) => {
    try {
      const result = await User.findOne({
        attributes: ["username", "user_role"],
        where: { username: username },
      });

      if (!result) {
        const error = new Error("User not found!");
        error.code = 401;
        throw error;
      } else {
        // Check if the user role exists and matches specific conditions
        const user_role_exists = await User.findOne({
          attributes: ["user_role"],
          where: {
            user_role: result.user_role,
          },
        });

        if (!user_role_exists || user_role_exists.user_role !== 1) {
          const error = new Error("Unauthorized User Role.");
          error.code = 401;
          throw error;
        }

        return true;
      }
    } catch (error) {
      throw error;
    }
  },

  checkIfUserExisting: async (username, first_name, last_name) => {
    try {
      const result = await User.findOne({
        attributes: ["username", "first_name", "last_name"],
        where: {
          username: username,
          first_name: first_name,
          last_name: last_name,
        },
      });

      if (result) {
        const error = new Error("User already exist!");
        error.code = 401;
        return true;
      }
    } catch (error) {
      throw error;
    }
  },
};
