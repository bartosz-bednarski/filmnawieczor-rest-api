const express = require("express");
require("dotenv").config();
const moviesRoutes = require("./routes/movies-routes");
const mainPageRoutes = require("./routes/mainPage-routes");
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
app.use("/api/homePage", mainPageRoutes);
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
