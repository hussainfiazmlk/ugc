const { errorHandler, errorConverter } = require("./middlewares/error");
const { jwtStrategy } = require("./config/passport");
const ApiError = require("./utils/ApiError");
const app = require("express")();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const httpStatus = require("http-status");
const passport = require("passport");
const routes = require("./routes");
const sequelize = require("./config/sequelize");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// const socket = require("socket.io");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for JSONPlaceholder",
    version: "1.0.0",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const defaultPort = 3000;
const port = process.env.PORT || defaultPort;

(async function () {
  try {
    await sequelize.sync();
    // await sequelize.sync({ alter: true });
    console.log("✅✅✅ Database sync complete.");

    app.listen(port, () => {
      console.log(`⚡⚡⚡ API is running on http://localhost:${port}`);
    });

    // rest of your server setup logic...
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();

app.use("/api/v1/stripe/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

app.use(cors());

app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.use("/api/v1", routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorHandler);
app.use(errorConverter);

// const io = socket(server, {
//   cors: {
//     origin:
//       process.env.NODE_ENV === "development"
//         ? "http://localhost:3001"
//         : "https://www.ugc.nl",
//   },
// });

// io.on("connection", (socket) => {
//   console.log("connected to the socket...");

//   socket.on("onTyping", (userId) => {
//     io.emit("sendTyping", userId);
//   });

//   socket.on("onStopTyping", (userId) => {
//     io.emit("sendStopTyping", userId);
//   });
// });

module.exports = app;
