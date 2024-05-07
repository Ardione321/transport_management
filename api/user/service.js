const { User, sequelize, Sequelize } = require("../../models");
const Op = Sequelize.Op;
const { checkUserIFAdmin }  = require('./utils');
/**
 * Authenticates a user and generates an access token and refresh token.
 *
 * @param {Object} data - User login data including username and password.
 * @returns {Object} - An object containing user details and tokens.
 * @throws {Object} - Error object with code and message in case of authentication failure.
 */
module.exports = {
    loginUser: async (data) => {
        try {
            // Hash the password for comparison
            
            // Find the user with the provided username and hashed password
            const user = await User.findOne({
                attributes: ['first_name', 'last_name', 'username', 'user_role'],
                where: {
                    username: data.username,
                    password: data.password
                }
            });

            // If no user is found, throw an error
            if (!user) {
                throw { code: 404, message: "Invalid username or password." };
            }
            // Create a payload to return
            const return_payload = {
                user_details: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    user_role: user.user_role,
                }
            };

            return return_payload;
        } catch (e) {
            throw e;
        }
    },

    registerUser: async (data) => {
        const transaction = await sequelize.transaction();
        try {
            const user_details = data;
            // Await for the check and catch any errors it throws
            await checkUserIFAdmin(user_details.admin_username);    
            
            await User.create({
                first_name: data.first_name,
                last_name: data.last_name,
                username: data.username,
                password: data.password,
                user_role: data.user_role
            }, { transaction });
            
            const result = {
                message: "Saving successful.",
                first_name: data.first_name,
                last_name: data.last_name,
                username: data.username
            };
    
            await transaction.commit();
            return result;
    
        } catch (e) {
            await transaction.rollback();
            // Rethrow or handle e to send an appropriate response
            throw e;
        }
    }
};