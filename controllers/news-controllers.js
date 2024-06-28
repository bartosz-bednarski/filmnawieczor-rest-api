const db = require("./db");
const getLast10News = async () => {
  const rows = await db.query(
    "select id,url,title,type,image_cover,cover_content from news WHERE ready_to_publish=1 order by id desc limit 10;"
  );
  return rows;
};
const getNewsDetails = async (newsUrl) => {
  const rows = await db.query(
    `select n.title AS "news_title",n.type,n.id as "news_id",nac.title AS "article_title",nac.image AS "article_image", nac.content AS "article_content", nac.id AS "article_id" FROM news_article_content nac JOIN news n ON nac.news_id=n.id where n.ready_to_publish=1 AND n.url='${newsUrl}'`
  );

  const newsTitle = rows[0].news_title;
  const rowsWithoutNewsTitle = rows.map(
    ({ article_title, article_image, article_content, article_id }) => ({
      article_title,
      article_image,
      article_content,
      article_id,
    })
  );
  const response = {
    news_title: newsTitle,
    type: rows[0].type,
    news_id: rows[0].news_id,
    news_details_data: rowsWithoutNewsTitle,
  };
  return response;
};

module.exports = {
  getLast10News,
  getNewsDetails,
};
