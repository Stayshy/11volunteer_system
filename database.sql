CREATE DATABASE volunteer_system;

\connect volunteer_system

CREATE TABLE volunteers (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            email VARCHAR(100) UNIQUE NOT NULL,
                            phone VARCHAR(20)
);

CREATE TABLE organizers (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            contact VARCHAR(100)
);

CREATE TABLE events (
                        id SERIAL PRIMARY KEY,
                        title VARCHAR(100) NOT NULL,
                        description TEXT,
                        date TIMESTAMP NOT NULL,
                        max_participants INTEGER NOT NULL,
                        organizer_id INTEGER REFERENCES organizers(id)
);

CREATE TABLE participations (
                                id SERIAL PRIMARY KEY,
                                volunteer_id INTEGER REFERENCES volunteers(id),
                                event_id INTEGER REFERENCES events(id),
                                UNIQUE(volunteer_id, event_id)
);

CREATE TABLE reports (
                         id SERIAL PRIMARY KEY,
                         volunteer_id INTEGER REFERENCES volunteers(id),
                         event_id INTEGER REFERENCES events(id),
                         description TEXT,
                         hours_worked INTEGER NOT NULL
);

-- Создание пользователя
CREATE USER volunteer_user WITH PASSWORD 'volunteer_password';
GRANT ALL PRIVILEGES ON DATABASE volunteer_system TO volunteer_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO volunteer_user;