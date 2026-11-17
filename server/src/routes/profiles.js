const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

const PROFILE_COLUMNS = `
  p.id, p.user_id AS userId, p.full_name AS fullName, u.email, p.phone,
  p.city, p.department, p.date_of_birth AS dateOfBirth, p.bio
`;

// GET /api/profiles/:id
// Returns the profile only if it belongs to the logged-in user
router.get('/:id', requireAuth, (req, res) => {
  const profile = db
    .prepare(
      `SELECT ${PROFILE_COLUMNS}
       FROM profiles p JOIN users u ON u.id = p.user_id
       WHERE p.id = ? AND p.user_id = ?`
    )
    .get(req.params.id, req.user.id);

  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  return res.json(profile);
});

module.exports = router;
