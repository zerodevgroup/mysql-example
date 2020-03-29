module.exports = {
  HOST: "localhost",
  USER: "devops",
  PASSWORD: "Zulu7!!",
  DB: "mydb",
  PORT: 1433,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
