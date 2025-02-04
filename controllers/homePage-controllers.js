const db = require("./db");
const getLatestMovies = async () => {
  const rows = await db.query(
    "select id,name,image_cover,description,url from movies where ready_to_publish=1 order by id desc limit 9;"
  );
  return rows;
};
const getLatestSeries = async () => {
  const rows = await db.query(
    "select id,name,image_cover,description from series where ready_to_publish=1 order by id desc limit 9;"
  );
  return rows;
};
const getLatestNews = async () => {
  const rows = await db.query(
    "select id,url,title,image_cover,cover_content from news where ready_to_publish=1 order by id desc limit 9;"
  );
  return rows;
};
module.exports = {
  getLatestMovies,
  getLatestSeries,
  getLatestNews,
};
