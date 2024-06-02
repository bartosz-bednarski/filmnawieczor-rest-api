const db = require("./db");

const getAllMovies = async () => {
  const rows = await db.query(
    "select movies.id,image_cover,name,description,movie_category as category, movie_rating as rating,production_year,action_place,action_time_start,action_time_end,movie_length from movies inner join movie_category on movie_category.movie_id=movies.id inner join movie_rating on movie_rating.movie_id=movies.id inner join production_year on production_year.movie_id=movies.id inner join action_place on action_place.movie_id=movies.id inner join action_time on action_time.movie_id=movies.id INNER join movie_length on movie_length.movie_id=movies.id"
  );
  return rows;
};

module.exports = {
  getAllMovies,
};
