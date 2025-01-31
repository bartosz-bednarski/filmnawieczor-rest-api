const db = require("./db");
const getMovieDetails = async (id) => {
  const rows = await db.query(
    `SELECT m.id AS 'id', m.name AS 'name', m.description AS 'description', md.meta_description as 'meta_description', md.url as 'url',md.image_details_cover AS 'image_cover', GROUP_CONCAT(DISTINCT ap.action_place SEPARATOR ', ') AS 'action_place', MIN(mat.action_time_start) AS 'action_time_start', MAX(mat.action_time_end) AS 'action_time_end', GROUP_CONCAT(DISTINCT mc.movie_category SEPARATOR ', ') AS 'category', ml.movie_length AS 'movie_length', mr.movie_rating AS 'rating', py.production_year AS 'production_year',u.universe_name AS 'universe' FROM movies m LEFT JOIN movies_action_place ap ON m.id = ap.movie_id LEFT JOIN movies_action_time mat ON m.id = mat.movie_id LEFT JOIN movies_categories mc ON m.id = mc.movie_id LEFT JOIN movies_length ml ON m.id = ml.movie_id LEFT JOIN movies_rating mr ON m.id = mr.movie_id LEFT JOIN movies_production_year py ON m.id = py.movie_id LEFT JOIN movies_details md ON m.id = md.movie_id LEFT JOIN universes u on u.id = m.universe Where m.ready_to_publish=1 AND m.id=${id} GROUP BY m.id, m.name, m.description, m.image_cover, ml.movie_length, mr.movie_rating, py.production_year order by m.id;`
  );
  return rows;
};
const getAllMoviesIds = async () =>{
  const rows = await db.query('SELECT id,name FROM movies;');
  return rows;
};
const getLast10Movies = async (req) => {
  const filterBy = req.data.filterBy;
  const filterOrder = req.data.filterOrder;
  const rows = await db.query(
    `SELECT m.id AS 'id', m.name AS 'name', md.meta_description AS 'description', m.image_cover AS 'image_cover', GROUP_CONCAT(DISTINCT ap.action_place SEPARATOR ', ') AS 'action_place', MIN(at.action_time_start) AS 'action_time_start', MAX(at.action_time_end) AS 'action_time_end', GROUP_CONCAT(DISTINCT mc.movie_category SEPARATOR ', ') AS 'category', ml.movie_length AS 'movie_length', mr.movie_rating AS 'rating', py.production_year AS 'production_year',u.universe_name AS 'universe' FROM movies m LEFT JOIN movies_action_place ap ON m.id = ap.movie_id LEFT JOIN movies_action_time at ON m.id = at.movie_id LEFT JOIN movies_categories mc ON m.id = mc.movie_id LEFT JOIN movies_details md on m.id=md.movie_id LEFT JOIN movies_length ml ON m.id = ml.movie_id LEFT JOIN movies_rating mr ON m.id = mr.movie_id LEFT JOIN movies_production_year py ON m.id = py.movie_id LEFT JOIN universes u on u.id = m.universe WHERE m.ready_to_publish=1 GROUP BY m.id, m.name, m.description, m.image_cover, ml.movie_length, mr.movie_rating, py.production_year order by ${filterBy} ${filterOrder} LIMIT 5;`
  );
  return rows;
};
const getNext5Movies = async (req) => {
  const offset = req.data.offset;
  const filterBy = req.data.filterBy;
  const filterOrder = req.data.filterOrder;
  const rows = await db.query(
    `SELECT m.id AS 'id', m.name AS 'name', md.meta_description AS 'description', m.image_cover AS 'image_cover', GROUP_CONCAT(DISTINCT ap.action_place SEPARATOR ', ') AS 'action_place', MIN(at.action_time_start) AS 'action_time_start', MAX(at.action_time_end) AS 'action_time_end', GROUP_CONCAT(DISTINCT mc.movie_category SEPARATOR ', ') AS 'category', ml.movie_length AS 'movie_length', mr.movie_rating AS 'rating', py.production_year AS 'production_year',u.universe_name AS 'universe' FROM movies m LEFT JOIN movies_action_place ap ON m.id = ap.movie_id LEFT JOIN movies_action_time at ON m.id = at.movie_id LEFT JOIN movies_categories mc ON m.id = mc.movie_id LEFT JOIN movies_details md on m.id=md.movie_id LEFT JOIN movies_length ml ON m.id = ml.movie_id LEFT JOIN movies_rating mr ON m.id = mr.movie_id LEFT JOIN movies_production_year py ON m.id = py.movie_id LEFT JOIN universes u on u.id = m.universe WHERE m.ready_to_publish=1 GROUP BY m.id, m.name, m.description, m.image_cover, ml.movie_length, mr.movie_rating, py.production_year order by ${filterBy} ${filterOrder} LIMIT 5 OFFSET ${offset};`
  );
  return rows;
};
const getLast10FilteredMovies = async (req) => {
  const queryFilters = req.data
    .map((item, index) => {
      //check if there is only one filter (no need to put and after each filter)
      if (req.data.length === 1) {
        //check if query is action time (need to separate req to two queries)
        if (item.queryName === "at.action_time") {
          if (item.queryValue.includes("-")) {
            const actionTimeStart = item.queryValue.slice(
              0,
              item.queryValue.indexOf("-")
            );
            const actionTimeEnd = item.queryValue.slice(
              item.queryValue.indexOf("-") + 1
            );
            return `at.action_time_start>=${actionTimeStart} and at.action_time_end<=${actionTimeEnd} `;
            console.log("start", actionTimeStart, "end", actionTimeEnd);
          } else {
            return `at.action_time_start=${item.queryValue} `;
          }
        }
        //check if query is production year (need to filter between dates)
        else if (item.queryName === "py.production_year") {
          if (item.queryValue.includes("-")) {
            const productionTimeStart = item.queryValue.slice(
              0,
              item.queryValue.indexOf("-")
            );
            const productionTimeEnd = item.queryValue.slice(
              item.queryValue.indexOf("-") + 1
            );
            return `py.production_year BETWEEN ${productionTimeStart} AND ${productionTimeEnd} `;
          } else {
            return `py.production_year=${item.queryValue} `;
          }
        }
        //classic query name with one query value
        else {
          return `${item.queryName}="${item.queryValue}"`;
        }
      }
      //check if there are more than one filters (have to add and after each filter)
      else if (req.data.length > 0) {
        //check if the current filter isn't the last one (no need to add and at the end of the query)
        if (index !== req.data.length - 1) {
          //check if query is action time (need to separate req to two queries)
          if (item.queryName === "at.action_time") {
            if (item.queryValue.includes("-")) {
              const actionTimeStart = item.queryValue.slice(
                0,
                item.queryValue.indexOf("-")
              );
              const actionTimeEnd = item.queryValue.slice(
                item.queryValue.indexOf("-") + 1
              );
              return `at.action_time_start>=${actionTimeStart} and at.action_time_end<=${actionTimeEnd} AND`;
              console.log("start", actionTimeStart, "end", actionTimeEnd);
            } else {
              return `at.action_time_start=${item.queryValue} AND`;
            }
          }
          //check if query is production year (need to filter between dates)
          else if (item.queryName === "py.production_year") {
            if (item.queryValue.includes("-")) {
              const productionTimeStart = item.queryValue.slice(
                0,
                item.queryValue.indexOf("-")
              );
              const productionTimeEnd = item.queryValue.slice(
                item.queryValue.indexOf("-") + 1
              );
              return `py.production_year BETWEEN ${productionTimeStart} AND ${productionTimeEnd} AND`;
            } else {
              return `py.production_year=${item.queryValue} AND`;
            }
          }
          //classic query name with one query value
          else {
            return `${item.queryName}="${item.queryValue}" AND`;
          }
        } else {
          //check if query is action time (need to separate req to two queries)
          if (item.queryName === "at.action_time") {
            if (item.queryValue.includes("-")) {
              const actionTimeStart = item.queryValue.slice(
                0,
                item.queryValue.indexOf("-")
              );
              const actionTimeEnd = item.queryValue.slice(
                item.queryValue.indexOf("-") + 1
              );
              return `at.action_time_start>=${actionTimeStart} and at.action_time_end<=${actionTimeEnd} `;
              console.log("start", actionTimeStart, "end", actionTimeEnd);
            } else {
              return `at.action_time_start=${item.queryValue} `;
            }
          }
          //check if query is production year (need to filter between dates)
          else if (item.queryName === "py.production_year") {
            if (item.queryValue.includes("-")) {
              const productionTimeStart = item.queryValue.slice(
                0,
                item.queryValue.indexOf("-")
              );
              const productionTimeEnd = item.queryValue.slice(
                item.queryValue.indexOf("-") + 1
              );
              return `py.production_year BETWEEN ${productionTimeStart} AND ${productionTimeEnd} `;
            } else {
              return `py.production_year=${item.queryValue} `;
            }
          }
          //classic query name with one query value
          else {
            return `${item.queryName}="${item.queryValue}"`;
          }
        }
      }
    })
    .join(" ");
  const queryParams = `SELECT m.id AS 'id', m.name AS 'name', md.meta_description AS 'description', m.image_cover AS 'image_cover', GROUP_CONCAT(DISTINCT ap.action_place SEPARATOR ', ') AS 'action_place', MIN(at.action_time_start) AS 'action_time_start', MAX(at.action_time_end) AS 'action_time_end', GROUP_CONCAT(DISTINCT mc.movie_category SEPARATOR ', ') AS 'category', ml.movie_length AS 'movie_length', mr.movie_rating AS 'rating', py.production_year AS 'production_year',u.universe_name AS 'universe' FROM movies m LEFT JOIN movies_action_place ap ON m.id = ap.movie_id LEFT JOIN movies_action_time at ON m.id = at.movie_id LEFT JOIN movies_categories mc ON m.id = mc.movie_id LEFT JOIN movies_length ml ON m.id = ml.movie_id LEFT JOIN movies_details md on m.id=md.movie_id LEFT JOIN movies_rating mr ON m.id = mr.movie_id LEFT JOIN movies_production_year py ON m.id = py.movie_id LEFT JOIN universes u on u.id = m.universe WHERE m.ready_to_publish=1 AND ${queryFilters} GROUP BY m.id, m.name, m.description, m.image_cover, ml.movie_length, mr.movie_rating, py.production_year order by ${req.filterBy} ${req.filterOrder} LIMIT 5;`;
  const rows = await db.query(queryParams);
  return rows;
};

const getNext5FilteredMovies = async (req) => {
  const queryFilters = req.data
    .map((item, index) => {
      //check if there is only one filter (no need to put and after each filter)
      if (req.data.length === 1) {
        //check if query is action time (need to separate req to two queries)
        if (item.queryName === "at.action_time") {
          if (item.queryValue.includes("-")) {
            const actionTimeStart = item.queryValue.slice(
              0,
              item.queryValue.indexOf("-")
            );
            const actionTimeEnd = item.queryValue.slice(
              item.queryValue.indexOf("-") + 1
            );
            return `at.action_time_start>=${actionTimeStart} and at.action_time_end<=${actionTimeEnd} `;
            console.log("start", actionTimeStart, "end", actionTimeEnd);
          } else {
            return `at.action_time_start=${item.queryValue} `;
          }
        }
        //check if query is production year (need to filter between dates)
        else if (item.queryName === "py.production_year") {
          if (item.queryValue.includes("-")) {
            const productionTimeStart = item.queryValue.slice(
              0,
              item.queryValue.indexOf("-")
            );
            const productionTimeEnd = item.queryValue.slice(
              item.queryValue.indexOf("-") + 1
            );
            return `py.production_year BETWEEN ${productionTimeStart} AND ${productionTimeEnd} `;
          } else {
            return `py.production_year=${item.queryValue} `;
          }
        }
        //classic query name with one query value
        else {
          return `${item.queryName}="${item.queryValue}"`;
        }
      }
      //check if there are more than one filters (have to add and after each filter)
      else if (req.data.length > 0) {
        //check if the current filter isn't the last one (no need to add and at the end of the query)
        if (index !== req.data.length - 1) {
          //check if query is action time (need to separate req to two queries)
          if (item.queryName === "at.action_time") {
            if (item.queryValue.includes("-")) {
              const actionTimeStart = item.queryValue.slice(
                0,
                item.queryValue.indexOf("-")
              );
              const actionTimeEnd = item.queryValue.slice(
                item.queryValue.indexOf("-") + 1
              );
              return `at.action_time_start>=${actionTimeStart} and at.action_time_end<=${actionTimeEnd} AND`;
              console.log("start", actionTimeStart, "end", actionTimeEnd);
            } else {
              return `at.action_time_start=${item.queryValue} AND`;
            }
          }
          //check if query is production year (need to filter between dates)
          else if (item.queryName === "py.production_year") {
            if (item.queryValue.includes("-")) {
              const productionTimeStart = item.queryValue.slice(
                0,
                item.queryValue.indexOf("-")
              );
              const productionTimeEnd = item.queryValue.slice(
                item.queryValue.indexOf("-") + 1
              );
              return `py.production_year BETWEEN ${productionTimeStart} AND ${productionTimeEnd} AND`;
            } else {
              return `py.production_year=${item.queryValue} AND`;
            }
          }
          //classic query name with one query value
          else {
            return `${item.queryName}="${item.queryValue}" AND`;
          }
        } else {
          //check if query is action time (need to separate req to two queries)
          if (item.queryName === "at.action_time") {
            if (item.queryValue.includes("-")) {
              const actionTimeStart = item.queryValue.slice(
                0,
                item.queryValue.indexOf("-")
              );
              const actionTimeEnd = item.queryValue.slice(
                item.queryValue.indexOf("-") + 1
              );
              return `at.action_time_start>=${actionTimeStart} and at.action_time_end<=${actionTimeEnd} `;
              console.log("start", actionTimeStart, "end", actionTimeEnd);
            } else {
              return `at.action_time_start=${item.queryValue} `;
            }
          }
          //check if query is production year (need to filter between dates)
          else if (item.queryName === "py.production_year") {
            if (item.queryValue.includes("-")) {
              const productionTimeStart = item.queryValue.slice(
                0,
                item.queryValue.indexOf("-")
              );
              const productionTimeEnd = item.queryValue.slice(
                item.queryValue.indexOf("-") + 1
              );
              return `py.production_year BETWEEN ${productionTimeStart} AND ${productionTimeEnd} `;
            } else {
              return `py.production_year=${item.queryValue} `;
            }
          }
          //classic query name with one query value
          else {
            return `${item.queryName}="${item.queryValue}"`;
          }
        }
      }
    })
    .join(" ");
  const queryParams = `SELECT m.id AS 'id', m.name AS 'name', md.meta_description AS 'description', m.image_cover AS 'image_cover', GROUP_CONCAT(DISTINCT ap.action_place SEPARATOR ', ') AS 'action_place', MIN(at.action_time_start) AS 'action_time_start', MAX(at.action_time_end) AS 'action_time_end', GROUP_CONCAT(DISTINCT mc.movie_category SEPARATOR ', ') AS 'category', ml.movie_length AS 'movie_length', mr.movie_rating AS 'rating', py.production_year AS 'production_year',u.universe_name AS 'universe' FROM movies m LEFT JOIN movies_action_place ap ON m.id = ap.movie_id LEFT JOIN movies_action_time at ON m.id = at.movie_id LEFT JOIN movies_categories mc ON m.id = mc.movie_id LEFT JOIN movies_length ml ON m.id = ml.movie_id LEFT JOIN movies_details md on m.id=md.movie_id LEFT JOIN movies_rating mr ON m.id = mr.movie_id LEFT JOIN movies_production_year py ON m.id = py.movie_id LEFT JOIN universes u on u.id = m.universe WHERE m.ready_to_publish=1 AND ${queryFilters} GROUP BY m.id, m.name, m.description, m.image_cover, ml.movie_length, mr.movie_rating, py.production_year order by ${req.filterBy} ${req.filterOrder} LIMIT 5 OFFSET ${req.offset};`;
  const rows = await db.query(queryParams);
  return rows;
};
module.exports = {
  getLast10Movies,
  getLast10FilteredMovies,
  getNext5Movies,
  getNext5FilteredMovies,
  getMovieDetails,
  getAllMoviesIds
};
