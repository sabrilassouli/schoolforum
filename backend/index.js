const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/courses");
const questionRoutes = require("./routes/question");
const answerRoutes = require("./routes/answer");

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
