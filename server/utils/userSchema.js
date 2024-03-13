export default {
  users: {
    columns: {
      id: {
        name: 'id',
        type: 'INT',
        auto_increment: true,
        primary_key: true,
      },
      name: {
        name: 'name',
        type: 'VARCHAR(255)',
        not_null: true,
        unique: true,
      },
      password: {
        name: 'password',
        type: 'VARCHAR(255)',
        not_null: true,
      },
      email: { 
        name: 'email',
        type: 'VARCHAR(255)',
        not_null: true,
        unique: true,
      },
      organization_name: { 
        name: 'organization_name',
        type: 'VARCHAR(255)',
        not_null: true,
      },
      fcm_token: {
        name: 'fcm_token',
        type: 'VARCHAR(255)',
        not_null: false, // Depending on your requirements, this can be true or false
      },
      created_at: {
        name: 'created_at',
        type: 'TIMESTAMP',
        not_null: true,
        default: 'CURRENT_TIMESTAMP', // Assuming you want to default to the current timestamp
      },
    },
  },
};
