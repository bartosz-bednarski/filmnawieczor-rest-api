const { response } = require("express");
const config = require("../config");
const mysql = require("mysql2");
const pool = mysql.createPool(config.db).promise();
async function query(params) {
  const [rows] = await pool.query(params);
  return rows;
  // db.query(params, (error, rows) => {
  //   if (error) {
  //     throw error;
  //   }
  //   return rows;
  // });
}

module.exports = { query };
