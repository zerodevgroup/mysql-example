const formidable = require("formidable")
const moment = require("moment")
const fs = require("fs")
const JSZip = require("jszip")

// Download a file
exports.downloadFile = (req, res) => {
  let timeStamp = req.params.timeStamp

  fs.readdir("/tmp", (err, items) => {

    let filesMatched = []

    items.forEach((item) => {
      let expression = new RegExp(`${timeStamp}\.xlsx`)

      if(item.match(expression)) {
        const fileName = `/tmp/${item}`

        let fileData = fs.readFileSync(fileName)

        filesMatched.push({
          name: item,
          data: fileData
        })
      }
    })

    if(filesMatched.length > 0) {
      let zip = new JSZip();
      let zipFile = `/tmp/${timeStamp}.zip`

      filesMatched.forEach((file) => {
        zip.file(file.name, file.data)
      })

      zip.generateAsync({type:"nodebuffer"}).then((content) => {
        fs.writeFileSync(zipFile, content)
        res.download(zipFile)
      })

    }

  })
}

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





