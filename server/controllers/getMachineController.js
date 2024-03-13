import db from '../utils/db.js';

const getMachines = (req, res) => {
  // Assuming you have a table named 'opc_ua_config' in your database
  const sql = 'SELECT * FROM opc_ua_config';
  db.query(sql, (err, machines) => {
    if (err) {
      console.error('Error fetching machines:', err);
      return res.status(500).json({ Error: "Internal server error" });
    }
    res.status(200).json(machines);
  });
};

export default getMachines;
