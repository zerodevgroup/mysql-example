module.exports = {
  HOST: "localhost",
  USER: "<your user>",
  PASSWORD: "<your password>",
  DB: "<your database>",
  PORT: 1433,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
