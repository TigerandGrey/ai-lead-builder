import { format, createLogger, transports } from "winston";
import { serverConfig } from "./server-config";

const CATEGORY = "ai-lead-builder-logs";
const isDevelopment = serverConfig.env === "development";
const { combine, timestamp, label, prettyPrint, colorize, simple } = format;

const logger = createLogger({
  level: isDevelopment ? "debug" : "info",
  format: combine(
    label({ label: CATEGORY }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    isDevelopment ? colorize() : simple(),
    isDevelopment ? prettyPrint() : format.json()
  ),
  transports: [new transports.Console()],
});

export default logger;
