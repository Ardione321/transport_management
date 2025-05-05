const { User, sequelize, Sequelize } = require("../../models");
const mysql = require('mysql2/promise');
const { checkUserIFAdmin } = require('./utils');
const { connectionConfig } = require('../model_mysql/database');
const {
    sendLogin
} = require("../../third_party_api/transport_management");
const passenger_group = require("../../models/passenger_group");
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
                    user_role: user.user_role
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
                user_role: data.user_role,
                mobile_number: data.mobile_number,
                email_add: data.email_add,
                pickup_dropoff_id: data.pickup_dropoff_id,
                passenger_group_id: data.passenger_group_id
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
    },

    addBulletinMessage: async(data) => {
        let connection;
        try {
            const { admin_username, holiday, announcement } = data;
            await checkUserIFAdmin(admin_username);

            connection = await mysql.createConnection(connectionConfig);

            await connection.beginTransaction();

            const insertQuery = `
                UPDATE bulletin 
                SET holiday = ?, announcement = ? 
                WHERE id = 12;
            `;

            await connection.execute(insertQuery, [holiday, announcement]);

            await connection.commit();

            const result = {
                message: "Saving successful.",
                holiday,
                announcement
            };

            return result;

        } catch (err) {
            console.error('Error saving shuttle:', err);
            if (connection) {
                await connection.rollback();
            }
            throw err;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    },

    updateDriverByDriverName: async (data) => {
        let connection;
        try {
            const { admin_username, username, first_name, last_name, mobile_number, email_add, pickup_dropoff_id } = data;
            await checkUserIFAdmin(admin_username);
    
            connection = await mysql.createConnection(connectionConfig);
    
            await connection.beginTransaction();
    
            const query = `
                UPDATE user
                SET first_name = ?, last_name = ?, mobile_number = ?, email_add = ?, pickup_dropoff_id = ?
                WHERE username = ? AND user_role = 3;
            `;
    
            await connection.execute(query, [first_name, last_name, mobile_number, email_add, pickup_dropoff_id, username]);
    
            await connection.commit();
    
            const result = {
                message: "Saving successful.",
            };
            return result;
    
        } catch (err) {
            console.error('Error updating driver:', err);
            if (connection) {
                await connection.rollback();
            }
            throw err;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    },

    updatePassengerByUserName: async (data) => {
        let connection;
        try {
            const { admin_username, username, first_name, last_name, mobile_number, email_add, passenger_group_id } = data;
            await checkUserIFAdmin(admin_username);
    
            connection = await mysql.createConnection(connectionConfig);
            await connection.beginTransaction();
    
            const query = `
                UPDATE user
                SET first_name = ?, last_name = ?, mobile_number = ?, email_add = ?, passenger_group_id = ?
                WHERE username = ? AND user_role = 2;
            `;
    
            await connection.execute(query, [first_name, last_name, mobile_number, email_add, passenger_group_id, username]);
            await connection.commit();
    
            const result = { message: "Saving successful." };
            return result;
    
        } catch (err) {
            console.error('Error during updatePassengerByUserNames:', err);
            if (connection) {
                await connection.rollback();
            }
            throw err;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    },
    

    getAllDriver: async(data) => {
        let connection;
        try {
            const { admin_username } = data;
            await checkUserIFAdmin(admin_username);
            connection = await mysql.createConnection(connectionConfig);

            await connection.beginTransaction();

            const query = `
                SELECT u.first_name, u.last_name, pd.pickup_dropoff, u.mobile_number, u.email_add, u.username
                FROM \`user\` u
                INNER JOIN \`pickup_dropoff\` pd ON u.pickup_dropoff_id = pd.id
                INNER JOIN \`passenger_group\` pg ON pd.passenger_group_id = pg.id
                WHERE u.user_role = 3
            `;

            const [results] = await connection.query(query);

            await connection.commit();

            // Transforming the results to the desired JSON format
            const passengerList = results.map(row => ({
                driver_name: row.first_name + " " + row.last_name,
                mobile_number: row.mobile_number,
                email_add: row.email_add,
                address: row.pickup_dropoff,
                username: row.username
            }));

            return passengerList;
        } catch (err) {
            console.error('Error fetching passenger list:', err);
            if (connection) {
                await connection.rollback();
            }
            throw err;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    },

    getDriverByUserName: async(data) => {
        let connection;
        try {
            const { username } = data;
            connection = await mysql.createConnection(connectionConfig);

            await connection.beginTransaction();

            const query = `
                SELECT u.first_name, u.last_name, pd.pickup_dropoff, u.mobile_number, u.email_add
                FROM \`user\` u
                INNER JOIN \`pickup_dropoff\` pd ON u.pickup_dropoff_id = pd.id
                INNER JOIN \`passenger_group\` pg ON pd.passenger_group_id = pg.id
                WHERE u.username = ? AND user_role = 3
            `;

            const [results] = await connection.query(query, [username]);

            await connection.commit();

            // Transforming the results to the desired JSON format
            const passengerList = results.map(row => ({
                driver_name: row.first_name + " " + row.last_name,
                mobile_number: row.mobile_number,
                email_add: row.email_add,
                address: row.pickup_dropoff
            }));

            return passengerList;
        } catch (err) {
            console.error('Error fetching passenger list:', err);
            if (connection) {
                await connection.rollback();
            }
            throw err;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    },

    getAllPassenger: async(data) => {
        let connection;
        try {
            const { admin_username } = data;
            connection = await mysql.createConnection(connectionConfig);
            await checkUserIFAdmin(admin_username);
            await connection.beginTransaction();

            const query = `
                SELECT u.first_name, u.last_name, pd.pickup_dropoff, u.mobile_number, u.email_add, pg.passenger_group, u.username
                FROM \`user\` u
                INNER JOIN \`pickup_dropoff\` pd ON u.pickup_dropoff_id = pd.id
                INNER JOIN \`passenger_group\` pg ON pd.passenger_group_id = pg.id
                WHERE u.user_role = 2
            `;

            const [results] = await connection.query(query);

            await connection.commit();

            // Transforming the results to the desired JSON format
            const passengerList = results.map(row => ({
                passenger_name: row.first_name + " " + row.last_name,
                mobile_number: row.mobile_number,
                email_add: row.email_add,
                address: row.pickup_dropoff,
                passenger_group: row.passenger_group,
                username: row.username
            }));

            return passengerList;
        } catch (err) {
            console.error('Error fetching passenger list:', err);
            if (connection) {
                await connection.rollback();
            }
            throw err;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    },

    getPassengerByUserName: async(data) => {
        let connection;
        try {
            const { username } = data;
            connection = await mysql.createConnection(connectionConfig);

            await connection.beginTransaction();

            const query = `
                SELECT u.first_name, u.last_name, pd.pickup_dropoff, u.mobile_number, u.email_add, pg.passenger_group
                FROM \`user\` u
                INNER JOIN \`pickup_dropoff\` pd ON u.pickup_dropoff_id = pd.id
                INNER JOIN \`passenger_group\` pg ON pd.passenger_group_id = pg.id
                WHERE u.username = ? AND u.user_role = 2
            `;

            const [results] = await connection.query(query, [username]);

            await connection.commit();

            // Transforming the results to the desired JSON format
            const passengerList = results.map(row => ({
                passenger_name: row.first_name + " " + row.last_name,
                mobile_number: row.mobile_number,
                email_add: row.email_add,
                address: row.pickup_dropoff,
                passenger_group: row.passenger_group
            }));

            return passengerList;
        } catch (err) {
            console.error('Error fetching passenger list:', err);
            if (connection) {
                await connection.rollback();
            }
            throw err;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
};