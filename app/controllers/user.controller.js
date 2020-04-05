const db = require("../models")
const fs = require("fs")
const _ = require("lodash")
const moment = require("moment")
const Op = db.Sequelize.Op
const User = db.users

// Retrieve all Users (or some) from the database.
exports.findAll = (req, res) => {
  const lastName = req.query.lastName
  var condition = lastName ? { lastName: { [Op.like]: `%${lastName}%` } } : null

  User.findAll({ where: condition })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      })
    })
}

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

// Arrange users into groups and actions
exports.groups = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "POST data can not be empty!"
    })
    return
  }

  res.json({
    status: "Processing" 
  })

  let groups = req.body

  let groupsResult = []

  // process groups
  for(let i = 0; i < groups.length; i++) {
    let group = groups[i]
    let data = await findData(group)

    let groupResult = {
      groupName: group.groupName,
      timeStamp: group.timeStamp,
      count: data.length,
      actions: [],
    }

    // create actions
    let actions = createActions({
      actions: group.actions,
      abTesting: group.abTesting,
      data: data,
    })

    // write csv files for each action utilizing file streaming
    actions.forEach((action) => {
      let fileName = `${group.groupName}_${action.name}_${action.index}_${group.timeStamp}.csv`
      let file = fs.createWriteStream(`/tmp/${fileName}`)

      action.data.forEach((item, index) => {
        if(index === 0) {
          file.write(toCsvHeader(item))
        }
        file.write(toCsv(item))
      })

      file.end()

      groupResult.actions.push({
        name: action.name,
        index: action.index,
        count: action.data.length
      })
    })

    groupsResult.push(groupResult)
  }

  console.log(groupsResult)
}

let findData = async (options) => {
  let condition = {}
  let filters = options.filters

  // filter data based on group filter(s)
  for(let i = 0; i < filters.length; i++) {
    let filter = filters[i]

    let filterId = filter.id.toUpperCase()
    let filterValue = filter.value

    condition[filterId] = filterValue
    try {
      let data = await User.findAll({ where: condition })
      return data
    }
    catch(error) {
      return error
    }
  }
}

let createActions = (options) => {
  // pre-process (parse) actions, including AB Testing if specified
  let actionFilters = parseActions(options)
  let data = options.data

  // Arrange actions by actionFilter
  let actions = []
  actionFilters.forEach((actionFilter, index) => {
    let action = {
      name: actionFilter.name,
      index: actionFilter.index ? actionFilter.index : index,
      data: []
    }

    // See if actionFilter has it's own data
    let actionData = actionFilter.data ? actionFilter.data : data

    // Filter action data based on actionFilter's filters
    actionData.forEach((item) => {
      if(actionFilter.filters) {
        let itemFound = true

        actionFilter.filters.forEach((filter) => {
          if(filter.operator) {
            if(!eval(`${_.toLower(item[filter.id])} ${filter.operator} ${_.toLower(filter.value)}`) {
              itemFound = false
            }
          }
          else {
            if(_.toLower(item[filter.id]) !== _.toLower(filter.value)) {
              itemFound = false
            }
          }
        })

        if(itemFound) {
          action.data.push(item)
        }
      }
      else {
        action.push(item)
      }
    })
    actions.push(action)
  })

  return actions
}

let parseActions = (options) => {
  let actionFilters = []
  let data = options.data
  options.actions.forEach((actionFilter, index) => {
    // check for AB Testing
    if(options.abTesting) {
      // splice half of the data
      let actionAData = data.splice(0, data.length / 2)
      let actionAFilter = Object.assign({data: actionAData, index: `${index}a`}, actionFilter)
      actionFilters.push(actionAFilter)

      // the previous splice changed the original array, leaving the remainder of the data that wasn't spliced out
      let actionBData = data
      let actionBFilter = Object.assign({data: actionBData, index: `${index}b`}, actionFilter)
      actionFilters.push(actionBFilter)
    }
    else {
      actionFilters.push(actionFilter)
    }
  })

  return actionFilters
}

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.firstName) {
    res.status(400).send({
      message: "Content can not be empty!"
    })
    return
  }

  // Create a User
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    renewalDate: req.body.renewalDate ? moment(new Date(req.body.renewalDate)).format("YYYY-MM-DD HH:MM:ss") : null
  }

  // Save User in the database
  User.create(user)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Users."
      })
    })  
}

// Create and Save a new Users in Bulk
exports.bulkCreate = (req, res) => {

  // TODO: Validate request
  const users = req.body

  users.map((user) => {
    user.renewalDate = user.renewalDate ? moment(new Date(user.renewalDate)).format("YYYY-MM-DD HH:MM:ss") : null
  })

  console.log(users)

  // Save Users into the database
  User.bulkCreate(users)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Users."
      })
    })
}
