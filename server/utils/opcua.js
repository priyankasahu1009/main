import mysql from 'mysql2';
import schema from './opcuaSchema.js'; // Import your schema here

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'UserAuth' // Change this to the correct database name if needed
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');

  // Check if the table 'opc_ua_config' exists
  connection.query('SHOW TABLES LIKE "opc_ua_config"', (err, result) => {
    if (err) {
      console.error('Error checking for table:', err);
      return;
    }

    // If the table 'opc_ua_config' doesn't exist, create it
    if (result.length === 0) {
      const createOpcUaConfigTableQuery = `
        CREATE TABLE opc_ua_config (
          ${schema.opc_ua_config.columns.id.name} ${schema.opc_ua_config.columns.id.type} ${schema.opc_ua_config.columns.id.auto_increment ? 'AUTO_INCREMENT' : ''} ${schema.opc_ua_config.columns.id.primary_key ? 'PRIMARY KEY' : ''},
          ${schema.opc_ua_config.columns.name.name} ${schema.opc_ua_config.columns.name.type} ${schema.opc_ua_config.columns.name.not_null ? 'NOT NULL' : ''},
          ${schema.opc_ua_config.columns.endpoint_url.name} ${schema.opc_ua_config.columns.endpoint_url.type} ${schema.opc_ua_config.columns.endpoint_url.not_null ? 'NOT NULL' : ''},
          ${schema.opc_ua_config.columns.security_policy.name} ${schema.opc_ua_config.columns.security_policy.type} ${schema.opc_ua_config.columns.security_policy.not_null ? 'NOT NULL' : ''},
          ${schema.opc_ua_config.columns.message_mode.name} ${schema.opc_ua_config.columns.message_mode.type} ${schema.opc_ua_config.columns.message_mode.not_null ? 'NOT NULL' : ''},
          
          ${schema.opc_ua_config.columns.password.name} ${schema.opc_ua_config.columns.password.type},
          ${schema.opc_ua_config.columns.certificate.name} ${schema.opc_ua_config.columns.certificate.type},
          ${schema.opc_ua_config.columns.private_key.name} ${schema.opc_ua_config.columns.private_key.type},
          ${schema.opc_ua_config.columns.user_id.name} ${schema.opc_ua_config.columns.user_id.type},
          ${schema.opc_ua_config.columns.created.name} ${schema.opc_ua_config.columns.created.type} ${schema.opc_ua_config.columns.created.not_null ? 'NOT NULL' : ''} DEFAULT ${schema.opc_ua_config.columns.created.default},
          FOREIGN KEY (${schema.opc_ua_config.columns.user_id.name}) REFERENCES users(id)
        )
      `;

      // Execute the create table query for opc_ua_config
      connection.query(createOpcUaConfigTableQuery, (err) => {
        if (err) {
          console.error('Error creating opc_ua_config table:', err);
        } else {
          console.log('Table opc_ua_config created successfully');
        }
      });
    } else {
      console.log('Table opc_ua_config already exists');
    }
  });
});

export default connection;
