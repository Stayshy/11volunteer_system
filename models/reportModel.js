const db = require('../config/db');

const getAllReports = async () => {
    const result = await db.query('SELECT * FROM reports');
    return result.rows;
};

const addReport = async (volunteer_id, event_id, description, hours_worked) => {
    const result = await db.query(
        'INSERT INTO reports (volunteer_id, event_id, description, hours_worked) VALUES ($1, $2, $3, $4) RETURNING *',
        [volunteer_id, event_id, description, hours_worked]
    );
    return result.rows[0];
};

module.exports = { getAllReports, addReport };