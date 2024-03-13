import mysql from 'mysql2';
import schema from './userSchema.js';

// Create a connection to the MySQL database server
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
 
});

// Connect to the MySQL server
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server:', err);
    return;
  }
  console.log('Connected to MySQL server');

  // Create the database if it doesn't exist
  db.query('CREATE DATABASE IF NOT EXISTS UserAuth', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database created or already exists');

    // Use the 'UserAuth' database
    db.query('USE UserAuth', (err) => {
      if (err) {
        console.error('Error selecting database:', err);
        return;
      }
      console.log('Using database: UserAuth');

      // Check if the table 'user' exists
      db.query('SHOW TABLES LIKE "user"', (err, result) => {
        if (err) {
          console.error('Error checking for table:', err);
          return;
        }

        // If the table 'user' doesn't exist, create it
        if (result.length === 0) {
          const createTableQuery = `
          CREATE TABLE user (
            ${schema.users.columns.id.name} ${schema.users.columns.id.type} ${schema.users.columns.id.auto_increment ? 'AUTO_INCREMENT' : ''} ${schema.users.columns.id.primary_key ? 'PRIMARY KEY' : ''},
            ${schema.users.columns.name.name} ${schema.users.columns.name.type} ${schema.users.columns.name.not_null ? 'NOT NULL' : ''} ${schema.users.columns.name.unique ? 'UNIQUE' : ''},
            ${schema.users.columns.password.name} ${schema.users.columns.password.type} ${schema.users.columns.password.not_null ? 'NOT NULL' : ''},
            ${schema.users.columns.email.name} ${schema.users.columns.email.type} ${schema.users.columns.email.not_null ? 'NOT NULL' : ''} ${schema.users.columns.email.unique ? 'UNIQUE' : ''},
            ${schema.users.columns.organization_name.name} ${schema.users.columns.organization_name.type} ${schema.users.columns.organization_name.not_null ? 'NOT NULL' : ''},
            ${schema.users.columns.fcm_token.name} ${schema.users.columns.fcm_token.type} ${schema.users.columns.fcm_token.not_null ? 'NOT NULL' : ''},
            ${schema.users.columns.created_at.name} ${schema.users.columns.created_at.type} ${schema.users.columns.created_at.not_null ? 'NOT NULL' : ''} DEFAULT ${schema.users.columns.created_at.default}
          )
        `;
        

          db.query(createTableQuery, (err) => {
            if (err) {
              console.error('Error creating table:', err);
            } else {
              console.log('Table user created successfully');
            }
          });
        } else {
          console.log('Table user already exists');
        }
      });
    });
  });
});

export default db;
