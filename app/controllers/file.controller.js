const formidable = require("formidable")
const moment = require("moment")

// Download a file
exports.downloadFile = (req, res) => {
  let fileName = req.params.fileName
  const file = `/tmp/${fileName}`

  console.log(file)

  res.download(file)
};


// Upload a file
exports.uploadFile = (req, res) => {
  new formidable.IncomingForm().parse(req)
    .on("field", (name, field) => {
      console.log("Field", name, field)
    })
    .on("fileBegin", (name, file) => {
      file.path = `/tmp/${file.name}`
    })
    .on("file", (name, file) => {
      console.log("Uploaded file", name, file)
    })
    .on("aborted", () => {
      console.error("Request aborted by the user")
    })
    .on("error", (err) => {
      console.error("Error", err)
      throw err
    })
    .on("end", () => {
      res.end()
    })
};
