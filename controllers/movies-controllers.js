const db = require("./db");

const getAllMovies = async () => {
  const rows = await db.query(
    "SELECT m.id AS 'id', m.name AS 'name', m.description AS 'description', m.image_cover AS 'image_cover', GROUP_CONCAT(DISTINCT ap.action_place SEPARATOR ', ') AS 'action_place', MIN(at.action_time_start) AS 'action_time_start', MAX(at.action_time_end) AS 'action_time_end', GROUP_CONCAT(DISTINCT mc.movie_category SEPARATOR ', ') AS 'category', ml.movie_length AS 'movie_length', mr.movie_rating AS 'rating', py.production_year AS 'production_year' FROM movies m LEFT JOIN action_place ap ON m.id = ap.movie_id LEFT JOIN action_time at ON m.id = at.movie_id LEFT JOIN movie_category mc ON m.id = mc.movie_id LEFT JOIN movie_length ml ON m.id = ml.movie_id LEFT JOIN movie_rating mr ON m.id = mr.movie_id LEFT JOIN production_year py ON m.id = py.movie_id GROUP BY m.id, m.name, m.description, m.image_cover, ml.movie_length, mr.movie_rating, py.production_year;"
  );
  return rows;
};

const getFilteredMovies = async (req) => {
  const queryFilters = req.data
    .map((item, index) => {
      if (req.data.length === 1) {
        return `${item.queryName}="${item.queryValue}" `;
      } else if (req.data.length > 0) {
        if (index !== req.data.length - 1) {
          return `${item.queryName}="${item.queryValue}" AND`;
        } else {
          return `${item.queryName}="${item.queryValue}"`;
        }
      }
    })
    .join(" ");
  const queryParams = `SELECT m.id AS 'id', m.name AS 'name', m.description AS 'description', m.image_cover AS 'image_cover', GROUP_CONCAT(DISTINCT ap.action_place SEPARATOR ', ') AS 'action_place', MIN(at.action_time_start) AS 'action_time_start', MAX(at.action_time_end) AS 'action_time_end', GROUP_CONCAT(DISTINCT mc.movie_category SEPARATOR ', ') AS 'category', ml.movie_length AS 'movie_length', mr.movie_rating AS 'rating', py.production_year AS 'production_year' FROM movies m LEFT JOIN action_place ap ON m.id = ap.movie_id LEFT JOIN action_time at ON m.id = at.movie_id LEFT JOIN movie_category mc ON m.id = mc.movie_id LEFT JOIN movie_length ml ON m.id = ml.movie_id LEFT JOIN movie_rating mr ON m.id = mr.movie_id LEFT JOIN production_year py ON m.id = py.movie_id WHERE ${queryFilters} GROUP BY m.id, m.name, m.description, m.image_cover, ml.movie_length, mr.movie_rating, py.production_year;`;
  const rows = await db.query(queryParams);
  // console.log(rows);
  return rows;
};
module.exports = {
  getAllMovies,
  getFilteredMovies,
};
