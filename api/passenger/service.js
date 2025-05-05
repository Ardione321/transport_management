const mysql = require('mysql2/promise');
const { checkUserIFAdmin, checkIfExistingSchedule } = require('./utils');
const { connectionConfig } = require('../model_mysql/database'); // Import the connection configuration
const passenger_group = require('../../models/passenger_group');

module.exports = {
    getPassengerList: async (data) => {
        let connection;
        try {
            const { admin_username, date } = data;
            await checkUserIFAdmin(admin_username);
    
            connection = await mysql.createConnection(connectionConfig);
    
            await connection.beginTransaction();
    
            const query = `
                SELECT pg.passenger_group, pd.pickup_dropoff, u.first_name, u.last_name, s.morning_pickup, s.post_work_dropoff
                FROM \`user\` u
                INNER JOIN \`pickup_dropoff\` pd ON u.pickup_dropoff_id = pd.id
                INNER JOIN \`passenger_group\` pg ON pd.passenger_group_id = pg.id
                INNER JOIN \`schedule\` s ON s.passenger_group_id = pg.id
                WHERE s.date = ? AND u.user_role = 2
                ORDER BY pg.passenger_group, pd.pickup_dropoff;
            `;
    
            const [results] = await connection.query(query, [date]);
    
            await connection.commit();
    
            const groupedPassengerList = results.reduce((acc, row) => {
                if (!acc[row.passenger_group]) {
                    acc[row.passenger_group] = {};
                }
                if (!acc[row.passenger_group][row.pickup_dropoff]) {
                    acc[row.passenger_group][row.pickup_dropoff] = [];
                }
                acc[row.passenger_group][row.pickup_dropoff].push({
                    firstName: row.first_name,
                    lastName: row.last_name,
                    morningPickup: row.morning_pickup,
                    postWorkDropoff: row.post_work_dropoff
                });
                return acc;
            }, {});
    
            return groupedPassengerList;
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

    getPassengerListGroupById: async (data) => {
        let connection;
        try {
            const { passenger_group_id } = data;

            connection = await mysql.createConnection(connectionConfig);

            await connection.beginTransaction();

            const query = `
                SELECT u.first_name, u.last_name, pd.pickup_dropoff
                FROM \`user\` u
                INNER JOIN \`pickup_dropoff\` pd ON pd.id = u.pickup_dropoff_id
                INNER JOIN \`passenger_group\` pg ON pg.id = pd.passenger_group_id
                WHERE pg.id = ? AND u.user_role = 2;
            `;

            const [results] = await connection.query(query, [passenger_group_id]);

            await connection.commit();

            // Transforming the results to the desired JSON format
            const passengerList = results.map(row => ({
                firstName: row.first_name,
                lastName: row.last_name,
                pickupDropoff: row.pickup_dropoff
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
    
    getBulletinAnnouncement: async (data) => {
        let connection;
        const { admin_username, date } = data;
        
        // Check if the user is an admin
        await checkUserIFAdmin(admin_username);
    
        try {
            connection = await mysql.createConnection(connectionConfig);
            await connection.beginTransaction();
    
            const scheduleQuery = `
                SELECT s.*, pg.passenger_group 
                FROM \`schedule\` s
                INNER JOIN \`passenger_group\` pg
                ON pg.id = s.passenger_group_id
                WHERE date = ?`;
            
            const remarksQuery = `SELECT * FROM remarks`;
    
            const [scheduleResults] = await connection.query(scheduleQuery, [date]);
            const [remarksResults] = await connection.query(remarksQuery);
    
            // Assuming remarksResults contains a list of remarks and we need the first one for the announcement
            const announcement = remarksResults.length > 0 ? remarksResults[0].announcement : "No announcements available";
    
            // Map the results to the desired format
            const passengerList = scheduleResults.map(row => ({
                morning_pickup: row.morning_pickup,
                post_work_dropoff: row.post_work_dropoff,
                driver: row.driver,
                shuttle: row.shuttle,
                passenger_group: row.passenger_group,
            }));
    
            await connection.commit();
    
            return {
                announcement,
                passengerList
            };
        } catch (error) {
            // Handle any errors
            if (connection) {
                await connection.rollback();
            }
            throw error;
        } finally {
            // Close the connection
            if (connection) {
                await connection.end();
            }
        }
    },

    getBulletinHoliday: async (data) => {
        let connection;
        const { admin_username } = data;
        
        // Check if the user is an admin
        await checkUserIFAdmin(admin_username);
    
        try {
            connection = await mysql.createConnection(connectionConfig);
            await connection.beginTransaction();
    
            const query = 'SELECT * FROM bulletin WHERE id = 12';
    
            const [results] = await connection.query(query);
    
            // Map the results to the desired format
            const passengerList = results.map(row => ({
                holiday: row.holiday,
                announcement: row.announcement
            }));
    
            await connection.commit();
    
            return passengerList;
        } catch (error) {
            // Handle any errors
            if (connection) {
                await connection.rollback();
            }
            throw error;
        } finally {
            // Close the connection
            if (connection) {
                await connection.end();
            }
        }
    },


    getPassengerGroup: async (data) => {
        let connection;
        try {
            const { admin_username } = data;
            await checkUserIFAdmin(admin_username);
    
            connection = await mysql.createConnection(connectionConfig);
    
            await connection.beginTransaction();
    
            const query = `
                SELECT pg.passenger_group, pd.pickup_dropoff, pd.longitude, pd.latitude
                FROM \`passenger_group\` pg
                INNER JOIN pickup_dropoff pd
                    ON pg.id = pd.passenger_group_id
            `;

            const [results] = await connection.query(query);
    
            await connection.commit();
    
            const formattedPassengerList = results.reduce((acc, row) => {
                const group = acc.find(g => g.passengerGroup === row.passenger_group);
                const pickupDropoff = {
                    pickupDropoff: row.pickup_dropoff,
                    longitude: row.longitude,
                    latitude: row.latitude
                };
    
                if (group) {
                    group.pickupDropoffs.push(pickupDropoff);
                } else {
                    acc.push({
                        passengerGroup: row.passenger_group,
                        pickupDropoffs: [pickupDropoff]
                    });
                }
    
                return acc;
            }, []);
    
            return formattedPassengerList;
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

    updateBulletinAnnouncement: async (data) => {
        const { admin_username, announcement } = data;
    
        // Check if the user is an admin
        await checkUserIFAdmin(admin_username);
    
        let connection;
    
        try {
            connection = await mysql.createConnection(connectionConfig);
            await connection.beginTransaction();
    
            const updateQuery = `UPDATE remarks SET announcement = ? WHERE id = 1`;
    
            await connection.query(updateQuery, [announcement]);
            await connection.commit();
    
            return { success: true, message: "Announcement updated successfully" };
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            throw error;
        } finally {
            // Close the connection
            if (connection) {
                await connection.end();
            }
        }
    },

    createSchedule: async(data) => {
        let connection;
        try {
            const { admin_username, morning_pickup, post_work_dropoff, driver, shuttle, date, passenger_group_id } = data;
            
            // Check if the user is an admin
            await checkUserIFAdmin(admin_username);
            const checkSchedule = await checkIfExistingSchedule(date, passenger_group_id);

            if(checkSchedule){
                throw new Error('Schedule with same date and passenger group is already exisiting!');
            }
            // Establish a connection to the MySQL database
            connection = await mysql.createConnection(connectionConfig);
    
            // Begin a transaction
            await connection.beginTransaction();
    
            // Insert the new schedule into the database
            const insertScheduleQuery = `
                INSERT INTO schedule (morning_pickup, post_work_dropoff, driver, shuttle, date, passenger_group_id)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            await connection.execute(insertScheduleQuery, [morning_pickup, post_work_dropoff, driver, shuttle, date, passenger_group_id]);
    
            // Commit the transaction
            await connection.commit();
    
            // Prepare the result to return
            const result = {
                message: "Schedule created successfully.",
                morning_pickup,
                post_work_dropoff,
                driver,
                shuttle,
                date,
                passenger_group_id
            };
    
            return result;
    
        } catch (err) {
            console.error('Error creating schedule:', err);
            if (connection) {
                // Rollback the transaction in case of an error
                await connection.rollback();
            }
            throw err;
        } finally {
            if (connection) {
                // Close the connection
                await connection.end();
            }
        }
    }
};