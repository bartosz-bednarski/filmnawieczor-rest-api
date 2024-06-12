const db = require("./db");

const getLast10Series = async () => {
  const rows = await db.query(
    "SELECT s.id AS 'id', s.name AS 'name',s.seasons_count AS 'seasons_count', s.description AS 'description', s.image_cover AS 'image_cover', GROUP_CONCAT(DISTINCT ap.action_place SEPARATOR ', ') AS 'action_place', MIN(at.action_time_start) AS 'action_time_start', MAX(at.action_time_end) AS 'action_time_end', GROUP_CONCAT(DISTINCT sc.serie_category SEPARATOR ', ') AS 'category', sr.serie_rating AS 'rating', MIN(py.production_year_start) AS 'production_year_start', MAX(py.production_year_end) AS 'production_year_end' FROM series s LEFT JOIN series_action_place ap ON s.id = ap.serie_id LEFT JOIN series_action_time at ON s.id = at.serie_id LEFT JOIN series_categories sc ON s.id = sc.serie_id LEFT JOIN series_rating sr ON s.id = sr.serie_id LEFT JOIN series_production_year py ON s.id = py.serie_id GROUP BY s.id, s.name, s.description, s.image_cover, sr.serie_rating, py.production_year_start, py.production_year_end order by s.id desc limit 10;"
  );
  return rows;
};

const getFilteredSeries = async (req) => {
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
  const queryParams = `SELECT m.id AS 'id', m.name AS 'name', m.description AS 'description', m.image_cover AS 'image_cover', GROUP_CONCAT(DISTINCT ap.action_place SEPARATOR ', ') AS 'action_place', MIN(at.action_time_start) AS 'action_time_start', MAX(at.action_time_end) AS 'action_time_end', GROUP_CONCAT(DISTINCT mc.movie_category SEPARATOR ', ') AS 'category', ml.movie_length AS 'movie_length', mr.movie_rating AS 'rating', py.production_year AS 'production_year' FROM movies m LEFT JOIN movies_action_place ap ON m.id = ap.movie_id LEFT JOIN movies_action_time at ON m.id = at.movie_id LEFT JOIN movies_categories mc ON m.id = mc.movie_id LEFT JOIN movies_length ml ON m.id = ml.movie_id LEFT JOIN movies_rating mr ON m.id = mr.movie_id LEFT JOIN movies_production_year py ON m.id = py.movie_id WHERE ${queryFilters} GROUP BY m.id, m.name, m.description, m.image_cover, ml.movie_length, mr.movie_rating, py.production_year order by s.id desc ;`;
  const rows = await db.query(queryParams);
  console.log(rows);
  return rows;
  // console.log("queryparams", queryParams);
  // return [];
};
module.exports = {
  getLast10Series,
  getFilteredSeries,
};
