const express = require("express");
const router = express.Router();
const movies = require("../controllers/movies-controllers");
router.get("/", async (req, res, next) => {
  try {
    res.json(await movies.getAllMovies());
    // const result = await db.query("SELECT * FROM movie_category");
    // console.log("results", result);
    // res.json(result);
    // // res.json(result);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(err);
  }
});
module.exports = router;
