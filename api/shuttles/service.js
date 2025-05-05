const { User, sequelize, Sequelize } = require("../../models");
const mysql = require('mysql2/promise');
const { checkUserIFAdmin } = require('./utils');
const { connectionConfig } = require('../model_mysql/database');

module.exports = {
    selectAllShuttles: async (data) => {
        let connection;
        try {
            const { admin_username } = data;
            await checkUserIFAdmin(admin_username);

            connection = await mysql.createConnection(connectionConfig);

            await connection.beginTransaction();

            const query = `
                SELECT * FROM shuttles;
            `;

            const [results] = await connection.query(query);

            await connection.commit();

            const formattedShuttlesList = results.map(row => ({
                id: row.id,
                name: row.name,
                model: row.model,
                plateNumber: row.plate_number,
                color: row.color,
                sitingCapacity: row.siting_capacity,
                coding: row.coding
            }));

            return formattedShuttlesList;
        } catch (err) {
            console.error('Error fetching shuttles:', err);
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

    registerShuttles: async (data) => {
        let connection;
        try {
            const { admin_username, name, model, plate_number, color, siting_capacity, coding } = data;
            await checkUserIFAdmin(admin_username);

            connection = await mysql.createConnection(connectionConfig);

            await connection.beginTransaction();

            const insertQuery = `
                INSERT INTO shuttles (name, model, plate_number, color, siting_capacity, coding)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            await connection.execute(insertQuery, [name, model, plate_number, color, siting_capacity, coding]);

            await connection.commit();

            const result = {
                message: "Saving successful.",
                model,
                plate_number,
                siting_capacity
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

    updateShuttle: async (data) => {
        let connection;
        try {
            const { admin_username, name, model, plate_number, color, siting_capacity, coding } = data;
            await checkUserIFAdmin(admin_username);

            connection = await mysql.createConnection(connectionConfig);

            await connection.beginTransaction();

            const updateQuery = `
                UPDATE shuttles 
                SET name = ?, model = ?, color = ?, siting_capacity = ?, coding = ?
                WHERE plate_number = ?
            `;

            const [result] = await connection.execute(updateQuery, [name, model, color, siting_capacity, coding, plate_number]);

            await connection.commit();

            if (result.affectedRows === 0) {
                throw new Error('No shuttle found with the provided plate number');
            }

            return {
                message: "Update successful.",
                model,
                plate_number,
                siting_capacity
            };

        } catch (err) {
            console.error('Error updating shuttle:', err);
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
};
