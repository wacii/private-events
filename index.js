const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "private-events-development",
  "wacii",
  "password",
  {
    host: "localhost",
    dialect: "postgres"
  }
);

sequelize.authenticate()
  .then(() => {
    console.log("Connected to the database.")
  })
  .catch(() => {
    console.error("Connection to database failed");
    process.exit(1);
  });

const User = sequelize.define('user', {
  id: {
    primaryKey: true,
    type: Sequelize.STRING
  }
});

(async () => {
  await User.sync();
  await User.create({ id: "some-really-long-id" + Date.now() });
  const users = await User.findAll();
  console.log(users);
  process.exit();
})();
