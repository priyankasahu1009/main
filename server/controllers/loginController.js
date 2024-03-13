import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../utils/db.js';

const login = (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM user WHERE email=?';
  db.query(sql, [email], (err, data) => {
    if (err) return res.status(500).json({ Error: "Internal server error" });
    if (data.length > 0) {
      bcrypt.compare(password, data[0].password, (err, response) => {
        if (err) return res.status(500).json({ Error: "Internal server error" });
        if (response) {
          const token = jwt.sign({ user_id: data[0].user_id, email: data[0].email }, "jwt-mysecret-key", { expiresIn: '1d' });
          res.cookie('token', token);
          return res.status(200).json({ Status: "Success" });
        } else {
          return res.status(400).json({ Error: "Password not matched" });
        }
      });
    } else {
      return res.status(404).json({ Error: "User not found" });
    }
  });
};

export default login;
