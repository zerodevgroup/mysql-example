module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new User
  router.post("/", users.create);

  // Bulk Create multiple Users
  router.post("/bulk", users.bulkCreate);

  app.use('/api/users', router);
};
