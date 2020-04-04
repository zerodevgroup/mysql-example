module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Find users
  router.get("/find/:lastName", users.findAll);

  // Export users
  router.post("/export", users.exportAll);

  // Create a new User
  router.post("/", users.create);

  // Bulk Create multiple Users
  router.post("/bulk", users.bulkCreate);

  app.use('/api/users', router);
};
