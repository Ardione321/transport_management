// Import necessary modules and models
const { User, UserRoles } = require("../../models");
const passenger_group = require("../../models/passenger_group");
const mysql = require("mysql2/promise");
const { connectionConfig } = require("../model_mysql/database"); // Import the connection configuration
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

  checkIfExistingSchedule: async (date, passenger_group_id) => {
    let connection;
    try {
      connection = await mysql.createConnection(connectionConfig);

      // Ensure the date is in YYYY-MM-DD format
      const formattedDate = new Date(date).toISOString().split("T")[0];

      const query = `
                SELECT 1 FROM \`schedule\`
                WHERE date = ? AND passenger_group_id = ?;
            `;

      const [results] = await connection.query(query, [
        formattedDate,
        passenger_group_id,
      ]);

      // Return true if at least one row is returned, otherwise false
      return results.length > 0;
    } catch (error) {
      console.error("Error checking if schedule exists:", error);
      return false;
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  },
};
