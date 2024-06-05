const db = require("./db");
const getLatestMovies = async () => {
  const rows = await db.query(
    "select id,name,image_cover from movies order by id desc limit 10;"
  );
  return rows;
};
const getLatestNews = async () => {
  const rows = await db.query(
    "select id,url,title,image_cover from news order by id desc limit 10;"
  );
  return rows;
};
module.exports = {
  getLatestMovies,
  getLatestNews,
};
