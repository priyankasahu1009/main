import mysql from 'mysql2';

// Function to establish connection to MySQL and select address column
export function selectAddressFromOpcuaNodes(callback) {
  // Create a connection to the MySQL database server
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "UserAuth" // Replace 'your_database_name' with your actual database name
  });

  // Connect to the MySQL server
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL server:', err);
      callback(err, null); // Pass error to callback
      return;
    }
    console.log('Connected to MySQL server');

    // Check if the table 'opcua_nodes' exists
    db.query('SHOW TABLES LIKE "opcua_nodes"', (err, result) => {
      if (err) {
        console.error('Error checking for table:', err);
        callback(err, null); // Pass error to callback
        db.end();
        return;
      }

      // If the table 'opcua_nodes' doesn't exist, create it
      if (result.length === 0) {
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS opcua_nodes (
          id INT PRIMARY KEY AUTO_INCREMENT,
          machine_id INT,
          address VARCHAR(100),
          name VARCHAR(100),
          status TINYINT(1)
        )
        `;

        db.query(createTableQuery, (err) => {
          if (err) {
            console.error('Error creating table:', err);
            callback(err, null); // Pass error to callback
          } else {
            console.log('Table opcua_nodes created successfully');
            selectAddress();
          }
        });
      } else {
        console.log('Table opcua_nodes already exists');
        selectAddress();
      }
    });

    // Function to select the address column from the opcua_nodes table
    function selectAddress() {
      // Select the address column from the table
      db.query('SELECT address FROM opcua_nodes', (err, results) => {
        if (err) {
          console.error('Error selecting address:', err);
          callback(err, null); // Pass error to callback
          db.end();
          return;
        }
        
        const addresses = results.map(row => row.address);
        console.log('Addresses:', addresses);

        // Close the database connection
        db.end();

        // Resolve the promise with the addresses
        callback(null, addresses);
      });
    }
  });
}
