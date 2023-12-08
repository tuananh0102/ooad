const app = require("express")();
const authRoutes = require("./auth");
const userRoutes = require("./user");
const jobsRoutes = require("./job");
const commentRoutes = require("./comment");
const educationRoutes = require("./education");
const employerRouter = require("./employer");
const jobseekerRouter = require("./jobseeker");
const applicationRouter = require("./application");
const helperRouter = require("./helper");
const chatRouter = require("./chat");
const cvRouter = require("./cv");

app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/jobseeker", jobseekerRouter);
app.use("/employer", employerRouter);
app.use("/comments", commentRoutes);
app.use("/job", jobsRoutes);
app.use("/application", applicationRouter);
app.use("/education", educationRoutes);
app.use("/chat", chatRouter);
app.use("/cv", cvRouter);
app.use("/helper", helperRouter);

module.exports = app;
