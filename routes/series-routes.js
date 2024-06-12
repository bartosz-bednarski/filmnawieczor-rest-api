const express = require("express");
const router = express.Router();
const series = require("../controllers/series-controllers");
router.get("/", async (req, res, next) => {
  try {
    // const data = await series.getSeries();
    res.json({ message: "Working good!" });
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.get("/last10", async (req, res, next) => {
  try {
    const data = await series.getLast10Series();
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});
router.post("/filter", async (req, res, next) => {
  try {
    const data = await series.getFilteredSeries(req.body);
    res.json(data);
  } catch (error) {
    console.error(`Error while getting programming languages `, error.message);
    next(error);
  }
});

module.exports = router;
