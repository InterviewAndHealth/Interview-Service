const express = require("express");
require("express-async-errors");
const cors = require("cors");
const error = require("./middlewares/error");
const routes = require("./api/routes");
const { DB } = require("./database");
const { InterviewService } = require("./services/rpcandeventservice");
const RPCService = require("./services/broker/rpc");
const EventService = require("./services/broker/events");
const { SERVICE_QUEUE } = require("./config/index");
const Broker = require("./services/broker/broker");

module.exports = async (app) => {
  await DB.connect();

  app.use(express.json());
  app.use(cors());
  app.use(routes);
  app.use(error);

  const interviewservice = new InterviewService();
  await Broker.connect();
  await RPCService.respond(interviewservice);
  await EventService.subscribe(SERVICE_QUEUE, interviewservice);
};
