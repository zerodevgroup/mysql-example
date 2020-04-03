module.exports = {
  HOST: "localhost",
  USER: "test",
  PASSWORD: "test",
  DB: "testdb",
  PORT: 1433,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
