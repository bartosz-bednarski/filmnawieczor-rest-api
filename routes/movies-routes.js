const express = require("express");
const router = express.Router();
const movies = require("../controllers/movies-controllers");
router.get("/", async (req, res, next) => {
  try {
    const data = await movies.getAllMovies();
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.post("/filter", async (req, res, next) => {
  try {
    const data = await movies.getFilteredMovies(req.body);
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});

module.exports = router;
