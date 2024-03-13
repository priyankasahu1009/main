import db from '../utils/db.js';
import schema from '../utils/opcuaSchema.js';
import bcrypt from 'bcrypt';
const salt = 10;
const addMachine = (req, res) => {
  const { name, endpoint_url, security_policy, message_mode, password, certificate, private_key, user_id } = req.body;


  const hashedPassword = bcrypt.hashSync(password, salt);
  // Validate user_id or any other required fields here

  // Insert the new machine into the database
  const sql = `INSERT INTO opc_ua_config(${schema.opc_ua_config.columns.name.name}, ${schema.opc_ua_config.columns.endpoint_url.name}, ${schema.opc_ua_config.columns.security_policy.name}, ${schema.opc_ua_config.columns.message_mode.name}, ${schema.opc_ua_config.columns.password.name}, ${schema.opc_ua_config.columns.certificate.name}, ${schema.opc_ua_config.columns.private_key.name}, ${schema.opc_ua_config.columns.user_id.name}) VALUES (?, ?, ?, ?, ?, ?, ?,  ?)`;
  const values = [name, endpoint_url, security_policy, message_mode, hashedPassword, certificate, private_key, user_id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200).json({ Status: "Success" });
  });
};

export default addMachine;
