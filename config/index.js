const dotEnv = require("dotenv");
const { EVENT_TYPES, RPC_TYPES } = require("./types");

// if (process.env.NODE_ENV !== "production") {
//   const configFile = `./.env.${process.env.NODE_ENV}`;
//   dotEnv.config({ path: configFile });
// } else {
//   dotEnv.config();
// }

dotEnv.config();

module.exports = {
  PORT: process.env.PORT || 8000,
  APP_SECRET: process.env.APP_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_NAME: process.env.DATABASE_NAME,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  SERVICE_NAME: process.env.SERVICE_NAME,
  SERVICE_QUEUE: process.env.SERVICE_QUEUE,
  RPC_QUEUE: process.env.RPC_QUEUE,
  USERS_SERVICE:process.env.USERS_SERVICE,
  USERS_QUEUE:process.env.USERS_QUEUE,
  USERS_RPC:process.env.USERS_RPC,
  PAYMENT_SERVICE:process.env.PAYMENT_SERVICE,
  PAYMENT_QUEUE:process.env.PAYMENT_QUEUE,
  PAYMENT_RPC:process.env.PAYMENT_RPC,
  EVENT_TYPES,
  RPC_TYPES,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};
