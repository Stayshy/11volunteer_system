const { Client } = require('pg');

const client = new Client({
  user: 'volunteer_user1',
  host: 'localhost', // Используем IPv4
  database: 'volunteer_system',
  password: '123',
  port: 5432,
});

// Подключаемся синхронно и логируем результат
try {
  client.connect();
  console.log('Connected to PostgreSQL');
} catch (err) {
  console.error('Connection error', err.stack);
}

module.exports = client;