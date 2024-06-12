const express = require("express");
const router = express.Router();
const mainPage = require("../controllers/homePage-controllers");
router.get("/", async (req, res, next) => {
  try {
    res.json({ message: "Working good!" });
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.get("/latestMovies", async (req, res, next) => {
  try {
    const data = await mainPage.getLatestMovies();
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.get("/latestSeries", async (req, res, next) => {
  try {
    const data = await mainPage.getLatestSeries();
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.get("/latestNews", async (req, res, next) => {
  try {
    const data = await mainPage.getLatestNews();
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});

module.exports = router;
