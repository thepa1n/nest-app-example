const DB_CONFIG = JSON.parse(process.env.DB_CONFIG);

module.exports = {
  host: DB_CONFIG.dbHost,
  type: DB_CONFIG.dbDialect,
  port: parseInt(DB_CONFIG.dbPort, 10),
  username: DB_CONFIG.dbUser,
  password: DB_CONFIG.dbPassword,
  database: DB_CONFIG.dbName,

  entities: [
    `dist/src/**/*.entity{.ts,.js}`,
    `dist/src/**/*.orm-entity{.ts,.js}`,
  ],
  migrationsTableName: process.env.TYPEORM_MIGRATIONS_TABLE_NAME,
  migrations: ['dist/db/migrations/*.js'],
  seeds: ['dist/db/seeds/**/*.seed.js'],
  cli: {
    migrationsDir: 'db/migrations',
  },
};
