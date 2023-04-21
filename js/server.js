// Import modules
const express = require('express');
const mysql = require('mysql2/promise');

// Set up Express app
const app = express();
app.use(express.json());

// Set up MySQL connection
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'myuser',
  password: 'mypassword',
  database: 'mydatabase',
  connectString: 'localhost:1521/XE',
  externalAuth: false,
  authSwitchHandler: (data, cb) => {
    if (data.pluginName === 'auth-pam') {
      const pam = require('authenticate-pam');
      pam.authenticate(data.username, data.password, (err) => {
        if (err) {
          return cb(err);
        }
        cb(null, []);
      });
    } else {
      return cb(new Error(`Unsupported auth plugin ${data.pluginName}`));
    }
  },
});

// Define API routes
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const [result] = await connection.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    res.status(200).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
