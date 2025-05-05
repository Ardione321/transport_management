require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const requestIp = require('request-ip');

const userRouter = require("./api/user/router");
const passengerRouter = require("./api/passenger/router");
const shuttlesRouter = require("./api/shuttles/router")

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(requestIp.mw());

app.use("/api/user", userRouter);
app.use("/api/passenger", passengerRouter);
app.use("/api/shuttles", shuttlesRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log("server up and running on PORT :", port);
});
