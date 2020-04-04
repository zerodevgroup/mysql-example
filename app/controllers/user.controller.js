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

// Arrange users into groups and segments
exports.groups = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "POST data can not be empty!"
    })
    return
  }

  let groups = req.body

  let groupsResult = []
  for(let i = 0; i < groups.length; i++) {
    let group = groups[i]
    let data = await findData(group)

    let groupResult = {
      groupName: group.groupName,
      timeStamp: group.timeStamp,
      count: data.length,
      segments: [],
    }

    let segments = createSegments({
      segments: group.segments,
      data: data,
    })

    segments.forEach((segment) => {
      let fileName = `${group.groupName}_${segment.name}_${group.timeStamp}.csv`
      let file = fs.createWriteStream(`/tmp/${fileName}`)

      segment.data.forEach((item, index) => {
        if(index === 0) {
          file.write(toCsvHeader(item))
        }
        file.write(toCsv(item))
      })

      file.end()

      groupResult.segments.push({
        name: segment.name,
        count: segment.data.length
      })
    })

    groupsResult.push(groupResult)
  }

  res.json(groupsResult)

  /*
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
  */
}

let findData = async (options) => {
  let condition = {}
  let filters = options.filters

  for(let i = 0; i < filters.length; i++) {
    let filter = filters[i]

    let filterId = filter.id.toUpperCase()
    let filterValue = filter.value

    condition[filterId] = filterValue
    try {
      let data = await User.findAll({ where: condition })
      console.log("FOUND DATA")
      return data
    }
    catch(error) {
      return error
    }
  }
}

let createSegments = (options) => {
  let segmentOptions = options.segments
  let data = options.data

  let segments = []
  segmentOptions.forEach((segmentOption) => {
    let segment = {
      name: segmentOption.name,
      data: []
    }

    data.forEach((item) => {
      if(segmentOption.filters) {
        let itemFound = true

        segmentOption.filters.forEach((filter) => {
          if(item[filter.id] !== filter.value) {
            itemFound = false
          }
        })

        if(itemFound) {
          segment.data.push(item)
        }
      }
      else {
        segment.push(item)
      }
    })
    segments.push(segment)
  })

  return segments
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
