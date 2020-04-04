module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    memberId: {
      type: Sequelize.STRING
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    createdDate: {
      type: Sequelize.STRING
    },
    timestamp: {
      type: Sequelize.STRING
    },
  },
  {
    timestamps: false, 
  });

  return User;
};
