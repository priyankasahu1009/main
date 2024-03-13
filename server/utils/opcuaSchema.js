export default {
    opc_ua_config: {
      columns: {
        id: {
          name: 'id',
          type: 'INT',
          auto_increment: true,
          primary_key: true,
        },
        name: {
          name: 'name',
          type: 'VARCHAR(200)',
          not_null: true,
        },
        endpoint_url: {
          name: 'endpoint_url',
          type: 'VARCHAR(200)',
          not_null: true,
        },
        security_policy: {
          name: 'security_policy',
          type: 'VARCHAR(200)',
          not_null: true,
        },
        message_mode: {
          name: 'message_mode',
          type: 'VARCHAR(200)',
          not_null: true,
        },
       
        password: {
          name: 'password',
          type: 'VARCHAR(300)',
        },
        certificate: {
          name: 'certificate',
          type: 'VARCHAR(300)',
        },
        private_key: {
          name: 'private_key',
          type: 'VARCHAR(300)',
        },
        user_id:{
            name: 'user_id',
            type: 'INT',
        },
        created: {
          name: 'created',
          type: 'DATETIME',
          not_null: true,
          default: 'CURRENT_TIMESTAMP',
        },
      },
    },
  };
  