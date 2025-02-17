const { Client } = require("pg")

const dbConfig = require("../config/db.config.js");
const tbl_prefix = 'spk_';
/*
const connection = async () => {
  try {
      const client = new Client({
          user: dbConfig.USER,
          host: dbConfig.HOST,
          database: dbConfig.DB,
          password: dbConfig.PASSWORD,
          port: dbConfig.PORT,
      })

      await client.connect()
      const res = await client.query('SELECT * FROM neo_users')
      console.log("connected")
      await client.end()
  } catch (error) {
      console.log(error)
  }
}
module.exports = connection;*/

const connection = new Client({
  user: dbConfig.USER,
          host: dbConfig.HOST,
          database: dbConfig.DB,
          password: dbConfig.PASSWORD,
          port: dbConfig.PORT,
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;
