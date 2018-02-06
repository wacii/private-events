const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "private-events-development",
  "wacii",
  "password",
  {
    dialect: "postgres",
    host: "localhost",
    operatorsAliases: false
  }
);

const Event = sequelize.define("event", {
  userId: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true
  },
  name: Sequelize.TEXT,
  location: Sequelize.TEXT,
  date: Sequelize.DATE
});

sequelize.sync()
  .then(() => {
    console.log("Database definition sync successful");
  })
  .catch(error => {
    console.error("Database definition sync failed", error);
    process.exit(1);
  });

module.exports = {
  sequelize,
  Event
};
