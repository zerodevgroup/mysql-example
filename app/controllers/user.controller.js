const db = require("../models");
const fs = require("fs")
const moment = require("moment")
const Op = db.Sequelize.Op;
const User = db.users;

// Retrieve all Users (or some) from the database.
exports.findAll = (req, res) => {
  const lastName = req.query.lastName;
  var condition = lastName ? { lastName: { [Op.like]: `%${lastName}%` } } : null;

  User.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

let toCsvHeader = (item) => {
  let csvHeader = ""
  Object.keys(item.dataValues).forEach((key, index) => {
    if(index > 0) {
      csvHeader += ","
    }
    csvHeader += `"${key}"`
  })

  csvHeader += "\n"
  return csvHeader
}

let toCsv = (item) => {
  let csv = ""
  Object.keys(item.dataValues).forEach((key, index) => {
    if(index > 0) {
      csv += ","
    }
    csv += `"${item.dataValues[key]}"`
  })

  csv += "\n"
  return csv
}

// Export all Users (or some) from the database.
exports.exportAll = (req, res) => {
  // Validate request
  if (!req.body.lastName || !req.body.fileName) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const fileName = req.body.fileName;
  const lastName = req.body.lastName;

  const file = fs.createWriteStream(`/tmp/${fileName}`)

  var condition = lastName ? { lastName: { [Op.like]: `%${lastName}%` } } : null;

  User.findAll({ where: condition })
  .then(data => {

    data.forEach((user, index) => {
      if(index === 0) {
        file.write(toCsvHeader(user))
      }
      file.write(toCsv(user))
    })

    file.end()

    res.send({count: data.length})
  })
  .catch(err => {
    res.status(500).send({
    message:
      err.message || "Some error occurred while retrieving tutorials."
    })
  })
}

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.firstName) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a User
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    renewalDate: req.body.renewalDate ? moment(new Date(req.body.renewalDate)).format("YYYY-MM-DD HH:MM:ss") : null
  };

  // Save User in the database
  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Users."
      });
    });  
};

// Create and Save a new Users in Bulk
exports.bulkCreate = (req, res) => {

  // TODO: Validate request
  const users = req.body;

  users.map((user) => {
    user.renewalDate = user.renewalDate ? moment(new Date(user.renewalDate)).format("YYYY-MM-DD HH:MM:ss") : null
  })

  console.log(users)

  // Save Users into the database
  User.bulkCreate(users)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Users."
      });
    });
};
