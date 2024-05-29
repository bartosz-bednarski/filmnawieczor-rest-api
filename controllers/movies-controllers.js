const db = require("./db");

const getAllMovies = async () => {
  const rows = await db.query("SELECT * FROM movies");
  return rows;
};

module.exports = {
  getAllMovies,
};
