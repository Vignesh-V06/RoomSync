const pool = require('../db/config');

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const [profiles] = await pool.query('SELECT * FROM profiles WHERE user_id = ?', [userId]);
    
    if (profiles.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profiles[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
};

exports.upsertProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      language, branch, cgpa_range, bed_pref, expected_members,
      sleep_pref, study_pref, food_pref, cleanliness
    } = req.body;

    const [existing] = await pool.query('SELECT * FROM profiles WHERE user_id = ?', [userId]);

    if (existing.length > 0) {
      await pool.query(
        `UPDATE profiles SET 
          language = ?, branch = ?, cgpa_range = ?, bed_pref = ?, expected_members = ?,
          sleep_pref = ?, study_pref = ?, food_pref = ?, cleanliness = ?
        WHERE user_id = ?`,
        [language, branch, cgpa_range, bed_pref, expected_members, sleep_pref, study_pref, food_pref, cleanliness, userId]
      );
      res.json({ message: 'Profile updated successfully' });
    } else {
      await pool.query(
        `INSERT INTO profiles (
          user_id, language, branch, cgpa_range, bed_pref, expected_members,
          sleep_pref, study_pref, food_pref, cleanliness
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, language, branch, cgpa_range, bed_pref, expected_members, sleep_pref, study_pref, food_pref, cleanliness]
      );
      res.status(201).json({ message: 'Profile created successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error saving profile' });
  }
};
