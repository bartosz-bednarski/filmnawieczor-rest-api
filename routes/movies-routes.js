const express = require("express");
const router = express.Router();
const movies = require("../controllers/movies-controllers");
router.get("/", async (req, res, next) => {
  try {
    const data = await movies.getLast10Movies();
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.post("/last10", async (req, res, next) => {
  try {
    const data = await movies.getLast10Movies(req.body);
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.post("/next5", async (req, res, next) => {
  try {
    const data = await movies.getNext5Movies(req.body);
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.post("/last10filtered", async (req, res, next) => {
  try {
    const data = await movies.getLast10FilteredMovies(req.body);
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.post("/next5filtered", async (req, res, next) => {
  try {
    const data = await movies.getNext5FilteredMovies(req.body);
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.get("/allIds", async (req,res, next) => {
  try {
    const data = await movies.getAllMoviesIds();
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.get("/allUrls", async (req,res, next) => {
  try {
    const data = await movies.getAllMoviesUrls();
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.get("/:movieId", async (req, res, next) => {
  try {
    const data = await movies.getMovieDetails(req.params.movieId);
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});

module.exports = router;
