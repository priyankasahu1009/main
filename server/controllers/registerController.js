import bcrypt from 'bcrypt';
import db from '../utils/db.js';
import schema from '../utils/userSchema.js';

const salt = 10;

const register = (req, res) => {
  const { name, password, email, organization_name } = req.body;

  // Check if the email already exists in the database
  db.query("SELECT * FROM user WHERE email = ?", [email], (err, rows) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (rows.length > 0) {
      // Email already exists, return an error
      return res.status(400).json({ Error: "User already exists" });
    }

    // Email does not exist, proceed with registration
    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Insert the new user into the database
    const sql = `INSERT INTO user(${schema.users.columns.name.name}, ${schema.users.columns.password.name}, ${schema.users.columns.email.name}, ${schema.users.columns.organization_name.name}) VALUES (?, ?, ?, ?)`;
    db.query(sql, [name, hashedPassword, email, organization_name], (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(200).json({ Status: "Success" });
    });
  });
};

export default register;
