const mysql = require("mysql2/promise");
const { checkUserIFAdmin, checkIfExistingSchedule } = require("./utils");
const { connectionConfig } = require("../model_mysql/database"); // Import the connection configuration
const passenger_group = require("../../models/passenger_group");

module.exports = {
  getPassengerList: async (data) => {
    let connection;
    try {
      const { admin_username, date } = data;
      await checkUserIFAdmin(admin_username);

      connection = await mysql.createConnection(connectionConfig);

      await connection.beginTransaction();

      const query = `
                SELECT pg.passenger_group, pd.pickup_dropoff, u.first_name, u.last_name, s.morning_pickup, s.post_work_dropoff, u.id
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
          passengerId: row.id,
          firstName: row.first_name,
          lastName: row.last_name,
          morningPickup: row.morning_pickup,
          postWorkDropoff: row.post_work_dropoff,
        });
        return acc;
      }, {});

      return groupedPassengerList;
    } catch (err) {
      console.error("Error fetching passenger list:", err);
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

  getScheduleByPassenger: async (data) => {
    let connection;
    try {
      const { admin_username, passenger_id, date } = data;

      await checkUserIFAdmin(admin_username);

      connection = await mysql.createConnection(connectionConfig);
      await connection.beginTransaction();

      // Query to get schedule info for the passenger on the given date
      const query = `
      SELECT s.id AS schedule_id, s.date, s.morning_pickup, s.post_work_dropoff, pg.passenger_group
      FROM schedule_passenger sp
      INNER JOIN schedule s ON sp.schedule_id = s.id
      INNER JOIN passenger_group pg ON s.passenger_group_id = pg.id
      WHERE sp.passenger_id = ? AND s.date = ? AND sp.status = 'in'
      ORDER BY s.date DESC
    `;

      const [results] = await connection.query(query, [passenger_id, date]);

      await connection.commit();

      return results;
    } catch (err) {
      console.error("Error fetching schedule by passenger:", err);
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

  getBoardedPassengersBySchedule: async (data) => {
    let connection;
    try {
      const { admin_username, date } = data;
      await checkUserIFAdmin(admin_username);

      connection = await mysql.createConnection(connectionConfig);
      await connection.beginTransaction();

      const query = `
      SELECT sp.schedule_id, sp.passenger_id, u.first_name, u.last_name, sp.status, sp.created_at
      FROM schedule_passengers sp
      INNER JOIN \`user\` u ON sp.passenger_id = u.id
      INNER JOIN \`schedule\` s ON sp.schedule_id = s.id
      WHERE sp.status = 'in' AND s.date = ?
      ORDER BY sp.schedule_id, u.last_name, u.first_name;
    `;

      const [results] = await connection.query(query, [date]);

      await connection.commit();

      // Group passengers by schedule_id
      const boardedPassengers = results.reduce((acc, row) => {
        if (!acc[row.schedule_id]) {
          acc[row.schedule_id] = [];
        }
        acc[row.schedule_id].push({
          passengerId: row.passenger_id,
          firstName: row.first_name,
          lastName: row.last_name,
          status: row.status,
          createdAt: row.created_at,
        });
        return acc;
      }, {});

      return boardedPassengers;
    } catch (err) {
      console.error("Error fetching boarded passengers:", err);
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
      const passengerList = results.map((row) => ({
        firstName: row.first_name,
        lastName: row.last_name,
        pickupDropoff: row.pickup_dropoff,
      }));

      return passengerList;
    } catch (err) {
      console.error("Error fetching passenger list:", err);
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
      const announcement =
        remarksResults.length > 0
          ? remarksResults[0].announcement
          : "No announcements available";

      // Map the results to the desired format
      const passengerList = scheduleResults.map((row) => ({
        morning_pickup: row.morning_pickup,
        post_work_dropoff: row.post_work_dropoff,
        driver: row.driver,
        shuttle: row.shuttle,
        passenger_group: row.passenger_group,
      }));

      await connection.commit();

      return {
        announcement,
        passengerList,
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

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    await checkUserIFAdmin(admin_username);

    try {
      connection = await mysql.createConnection(connectionConfig);
      await connection.beginTransaction();

      const query = "SELECT * FROM holidays";

      const [results] = await connection.query(query);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const passengerList = results
        .filter((row) => {
          const holidayDate = new Date(row.date);
          return (
            holidayDate.getMonth() === currentMonth &&
            holidayDate.getFullYear() === currentYear
          );
        })
        .map((row) => {
          const holidayDate = new Date(row.date);
          const formattedDate = `${
            monthNames[holidayDate.getMonth()]
          } ${holidayDate.getDate()}, ${holidayDate.getFullYear()}`;
          return {
            holiday: formattedDate,
            announcement: row.title,
          };
        });

      await connection.commit();

      return passengerList;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
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
        const group = acc.find((g) => g.passengerGroup === row.passenger_group);
        const pickupDropoff = {
          pickupDropoff: row.pickup_dropoff,
          longitude: row.longitude,
          latitude: row.latitude,
        };

        if (group) {
          group.pickupDropoffs.push(pickupDropoff);
        } else {
          acc.push({
            passengerGroup: row.passenger_group,
            pickupDropoffs: [pickupDropoff],
          });
        }

        return acc;
      }, []);

      return formattedPassengerList;
    } catch (err) {
      console.error("Error fetching passenger list:", err);
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

  createSchedule: async (data) => {
    let connection;
    try {
      const {
        admin_username,
        morning_pickup,
        post_work_dropoff,
        driver,
        shuttle,
        date,
        passenger_group_id,
      } = data;

      // Check if the user is an admin
      await checkUserIFAdmin(admin_username);
      const checkSchedule = await checkIfExistingSchedule(
        date,
        passenger_group_id
      );

      if (checkSchedule) {
        throw new Error(
          "Schedule with same date and passenger group is already exisiting!"
        );
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

      await connection.execute(insertScheduleQuery, [
        morning_pickup,
        post_work_dropoff,
        driver,
        shuttle,
        date,
        passenger_group_id,
      ]);

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
        passenger_group_id,
      };

      return result;
    } catch (err) {
      console.error("Error creating schedule:", err);
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
  },

  createOrUpdatePassengerBySchedule: async (data) => {
    let connection;
    try {
      const { admin_username, schedule_id, passenger_id, status = "in" } = data;

      await checkUserIFAdmin(admin_username);

      connection = await mysql.createConnection(connectionConfig);
      await connection.beginTransaction();

      const checkQuery = `
      SELECT id FROM schedule_passengers
      WHERE schedule_id = ? AND passenger_id = ?
      LIMIT 1
    `;
      const [existing] = await connection.query(checkQuery, [
        schedule_id,
        passenger_id,
      ]);

      if (existing.length > 0) {
        const updateQuery = `
        UPDATE schedule_passengers
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE schedule_id = ? AND passenger_id = ?
      `;
        await connection.query(updateQuery, [
          status,
          schedule_id,
          passenger_id,
        ]);
      } else {
        const insertQuery = `
        INSERT INTO schedule_passengers (schedule_id, passenger_id, status)
        VALUES (?, ?, ?)
      `;
        await connection.query(insertQuery, [
          schedule_id,
          passenger_id,
          status,
        ]);
      }

      await connection.commit();

      return {
        message: "Passenger schedule record created or updated successfully",
      };
    } catch (err) {
      console.error("Error creating or updating passenger schedule:", err);
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

  getScheduleByPassenger: async (data) => {
    let connection;
    try {
      const { admin_username, passenger_id, date } = data;

      await checkUserIFAdmin(admin_username);

      connection = await mysql.createConnection(connectionConfig);
      await connection.beginTransaction();

      const todayQuery = `
      SELECT 
        u.id AS passenger_id,
        pg.id AS passenger_group_id,
        pg.passenger_group, 
        pd.pickup_dropoff, 
        u.first_name, 
        u.last_name, 
        s.morning_pickup, 
        s.post_work_dropoff,
        s.id AS schedule_id
      FROM \`user\` u
      INNER JOIN \`pickup_dropoff\` pd ON u.pickup_dropoff_id = pd.id
      INNER JOIN \`passenger_group\` pg ON pd.passenger_group_id = pg.id
      INNER JOIN \`schedule\` s ON s.passenger_group_id = pg.id
      WHERE u.id = ? AND s.date = ? AND u.user_role = 2
      LIMIT 1;
    `;

      const [todayResult] = await connection.query(todayQuery, [
        passenger_id,
        date,
      ]);

      const response = {};

      if (todayResult.length > 0) {
        const todayData = todayResult[0];

        response.todaySchedule = {
          passenger_id: todayData.passenger_id,
          passenger_group: todayData.passenger_group,
          pickup_dropoff: todayData.pickup_dropoff,
          first_name: todayData.first_name,
          last_name: todayData.last_name,
          morning_pickup: todayData.morning_pickup,
          post_work_dropoff: todayData.post_work_dropoff,
          schedule_id: todayData.schedule_id,
        };

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        const formattedDate = nextDate.toISOString().split("T")[0];

        const tomorrowQuery = `
        SELECT 
          s.morning_pickup, 
          s.post_work_dropoff, 
          s.date,
          s.id AS schedule_id
        FROM \`schedule\` s
        WHERE s.passenger_group_id = ? AND s.date = ?
        LIMIT 1;
      `;

        const [tomorrowResult] = await connection.query(tomorrowQuery, [
          todayData.passenger_group_id,
          formattedDate,
        ]);

        if (tomorrowResult.length > 0) {
          const schedule = tomorrowResult[0];
          response.nextDaySchedule = {
            date: schedule.date,
            morning_pickup: schedule.morning_pickup,
            post_work_dropoff: schedule.post_work_dropoff,
            schedule_id: schedule.schedule_id,
          };
        }
      }

      await connection.commit();
      return response;
    } catch (err) {
      console.error("Error fetching schedule by passenger:", err);
      if (connection) await connection.rollback();
      throw err;
    } finally {
      if (connection) await connection.end();
    }
  },

  getScheduleSummaryReport: async (data) => {
    let connection;
    try {
      const { admin_username, startDate, endDate } = data;

      await checkUserIFAdmin(admin_username);
      connection = await mysql.createConnection(connectionConfig);
      await connection.beginTransaction();

      const query = `
        SELECT 
          s.id AS schedule_id,
          s.date,
          pg.passenger_group,
          s.driver,
          s.shuttle,
          COUNT(DISTINCT usp.id) AS total_passengers,
          COUNT(DISTINCT IF(sp.status = 'in', sp.passenger_id, NULL)) AS boarded_passengers
        FROM schedule s
        INNER JOIN passenger_group pg ON pg.id = s.passenger_group_id
        LEFT JOIN schedule_passengers sp ON sp.schedule_id = s.id
        LEFT JOIN user usp ON usp.pickup_dropoff_id IN (
          SELECT id FROM pickup_dropoff WHERE passenger_group_id = pg.id
        ) AND usp.user_role = 2
        WHERE s.date BETWEEN ? AND ?
        GROUP BY s.id, s.date, pg.passenger_group, s.driver, s.shuttle
        ORDER BY s.date, pg.passenger_group;
      `;

      const [results] = await connection.query(query, [startDate, endDate]);
      await connection.commit();

      return results.map((row) => ({
        scheduleId: row.schedule_id,
        date: row.date,
        passengerGroup: row.passenger_group,
        driver: row.driver,
        shuttle: row.shuttle,
        totalPassengers: row.total_passengers,
        boardedPassengers: row.boarded_passengers,
      }));
    } catch (err) {
      console.error("Error generating report:", err);
      if (connection) await connection.rollback();
      throw err;
    } finally {
      if (connection) await connection.end();
    }
  },
};
