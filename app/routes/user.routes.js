module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Find users
  router.get("/find/:lastName", users.findAll);

  // Export users as segments to CSV files
  router.post("/groups", users.groups);

  // Show count of users based on filter(s)
  router.post("/count", users.count);

  // Filter users based on filter(s)
  router.post("/filter", users.filter);

  // Create a new User
  router.post("/", users.create);

  // Bulk Create multiple Users
  router.post("/bulk", users.bulkCreate);

  app.use('/api/users', router);
};
