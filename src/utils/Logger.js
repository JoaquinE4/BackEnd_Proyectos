import winston from "winston";
import { config } from "../config/congif.js";

let debug = config.DEBUG;

const levels = {
  debug: 5,
  http: 4,
  info: 3,
  warning: 2,
  error: 1,
  fatal: 0,
};

const levelColors = {
  debug: "blue",
  http: "magenta",
  info: "green",
  warning: "yellow",
  error: "red",
  fatal: "red bold",
};

winston.addColors(levelColors);

const transportWarn = new winston.transports.File({
  level: "warning",
  filename: "./errorLogs.log",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
});


const transportDebug = new winston.transports.Console({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
});

const transportInfo = new winston.transports.Console({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
});

export const logger = winston.createLogger({
  levels: levels,
  transports: [transportInfo, transportWarn],
});

if (debug === "true") {
  logger.remove(transportInfo);
  logger.add(transportDebug);
}

export const middLogger = (req, res, next) => {
  req.logger = logger;
  next();
};
