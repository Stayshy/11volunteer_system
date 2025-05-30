const db = require('../config/db');

const getAllVolunteers = async () => {
    const result = await db.query('SELECT * FROM volunteers');
    return result.rows;
};

const addVolunteer = async (name, email, phone) => {
    const result = await db.query(
        'INSERT INTO volunteers (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
        [name, email, phone]
    );
    return result.rows[0];
};

const updateVolunteer = async (id, name, email, phone) => {
    const result = await db.query(
        'UPDATE volunteers SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *',
        [name, email, phone, id]
    );
    return result.rows[0];
};

const deleteVolunteer = async (id) => {
    await db.query('DELETE FROM volunteers WHERE id = $1', [id]);
};

const query = async (text, params) => {
    const result = await db.query(text, params);
    return result.rows;
};

module.exports = { getAllVolunteers, addVolunteer, updateVolunteer, deleteVolunteer, query };