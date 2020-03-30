module.exports = app => {
  const files = require("../controllers/file.controller.js");

  var router = require("express").Router();

  // Download a file
  router.get("/download/:fileName", files.downloadFile);

  // Upload a file
  router.post("/upload", files.uploadFile);

  app.use('/api/files', router);
};
