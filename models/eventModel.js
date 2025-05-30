const db = require('../config/db');

const getAllEvents = async () => {
    const result = await db.query('SELECT * FROM events');
    return result.rows;
};

const addEvent = async (title, description, date, max_participants, organizer_id) => {
    const result = await db.query(
        'INSERT INTO events (title, description, date, max_participants, organizer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, description, date, max_participants, organizer_id]
    );
    return result.rows[0];
};

const updateEvent = async (id, title, description, date, max_participants, organizer_id) => {
    const result = await db.query(
        'UPDATE events SET title = $1, description = $2, date = $3, max_participants = $4, organizer_id = $5 WHERE id = $6 RETURNING *',
        [title, description, date, max_participants, organizer_id, id]
    );
    return result.rows[0];
};

const deleteEvent = async (id) => {
    await db.query('DELETE FROM events WHERE id = $1', [id]);
};

module.exports = { getAllEvents, addEvent, updateEvent, deleteEvent };