const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, fullName, phone, city, department, dateOfBirth, bio } = req.body || {};

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Email, password and full name are required' });
  }

  const normalisedEmail = String(email).trim().toLowerCase();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalisedEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = db
    .prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
    .run(normalisedEmail, passwordHash);

  const profile = db
    .prepare(
      `INSERT INTO profiles (user_id, full_name, phone, city, department, date_of_birth, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      user.lastInsertRowid,
      fullName,
      phone ?? null,
      city ?? null,
      department ?? null,
      dateOfBirth ?? null,
      bio ?? null
    );

  return res.status(201).json({
    message: 'Account created',
    userId: Number(user.lastInsertRowid),
    profileId: Number(profile.lastInsertRowid),
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(String(email || '').trim().toLowerCase());

  if (!user || !bcrypt.compareSync(password || '', user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const profile = db.prepare('SELECT id FROM profiles WHERE user_id = ?').get(user.id);
  const token = jwt.sign({ sub: String(user.id), email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });

  return res.json({
    token,
    user: { id: user.id, email: user.email, profileId: profile ? profile.id : null },
  });
});

module.exports = router;
