const express = require("express");
const router = express.Router();
const newsPage = require("../controllers/news-controllers");
router.get("/", async (req, res, next) => {
  try {
    res.json({ message: "Working good!" });
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.get("/last10News", async (req, res, next) => {
  try {
    const data = await newsPage.getLast10News();
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.get("/:newsDetails", async (req, res, next) => {
  try {
    const data = await newsPage.getNewsDetails(req.params.newsDetails);
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});

module.exports = router;
