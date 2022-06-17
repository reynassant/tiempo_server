const dotenv = require("dotenv");
const mysql = require("mysql");

dotenv.config();

const ddbbConf = {
  host: "localhost",
  user: "root",
  password: process.env.SQLPASS || "krono",
  database: "ltiempo",
};

function executeQuery(query, callback, res) {
  var con = mysql.createConnection(ddbbConf);
  try {
    con.connect(function (err) {
      if (err) throw err;
      // eslint-disable-next-line no-unused-vars
      con.query(query, function (err, result, fields) {
        if (err) throw err;
        con.end();
        callback(result, res);
      });
    });
  } catch (err) {
    con.end();
    console.log(err);
  }
}

module.exports = {
  executeQuery: executeQuery,
};
