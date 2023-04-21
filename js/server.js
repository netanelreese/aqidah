// Import modules
const express = require('express');
const mysql = require('mysql2/promise');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

// Set up Express app
const app = express();
app.use(session({
  secret: 'your-secret-key-here',
  resave: false,
  saveUninitialized: true
}));

//user model
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/user');

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username: username }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Incorrect username.' }); }

    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        // passwords match
        return done(null, user);
      } else {
        // passwords do not match
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}));

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

// Middleware to check if user is authorized
function isAuthorized(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  res.status(403).send('Unauthorized');
}

function getUserByUsername(username) {
  return users.find(user => user.username === username);
}

function getUserById(id) {
  return users.find(user => user.id === id);
}

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
