module.exports = app => {
  const files = require("../controllers/file.controller.js");

  var router = require("express").Router();

  // Download a file
  router.get("/download/:timeStamp", files.downloadFile);

  // Download a file
  router.get("/find/:fileName", files.findFile);

  // Upload a file
  router.post("/upload", files.uploadFile);

  app.use('/api/files', router);
};
