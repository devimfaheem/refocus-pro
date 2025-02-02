require("dotenv").config();
require("reflect-metadata");
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: +process.env.DATABASE_PORT || 3306,
  username: process.env.DATABASE_USER || "admin",
  password: process.env.DATABASE_PASSWORD || "admin",
  database: process.env.DATABASE_NAME || "admin",
  entities: ["dist/**/*.entity.js"], // Use compiled JS files
  migrations: ["dist/src/migrations/*.js"], // Use compiled JS files
  synchronize: false,
  logging: true,
});

module.exports = { AppDataSource };
