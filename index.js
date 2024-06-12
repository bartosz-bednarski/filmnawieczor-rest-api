const express = require("express");
require("dotenv").config();
const moviesRoutes = require("./routes/movies-routes");
const seriesRoutes = require("./routes/series-routes");
const homePageRoutes = require("./routes/homePage-routes");
const newsPageRoutes = require("./routes/news-routes");
const HttpError = require("./models/http-error");
const cors = require("cors");
const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 9001;
app.use("/api/movies", moviesRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/homePage", homePageRoutes);
app.use("/api/news", newsPageRoutes);
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  //   if (res.headerSent) {
  //     return next(error);
  //   }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});
app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
