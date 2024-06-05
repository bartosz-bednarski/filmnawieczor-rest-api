const express = require("express");
const router = express.Router();
const movies = require("../controllers/movies-controllers");
router.get("/", async (req, res, next) => {
  try {
    const data = await movies.getAllMovies();
    res.json(data);
    // const result = await db.query("SELECT * FROM movie_category");
    // console.log("results", result);
    // res.json(result);
    // // res.json(result);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.post("/filter", async (req, res, next) => {
  try {
    // console.log(req.body);
    // res.json({ message: "ok" });
    const data = await movies.getFilteredMovies(req.body);
    res.json(data);
    // const result = await db.query("SELECT * FROM movie_category");
    // console.log("results", result);
    // res.json(result);
    // // res.json(result);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});

module.exports = router;
