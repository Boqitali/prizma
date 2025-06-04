import { utilities } from "nest-winston";
import { format } from "path";
import * as winston from "winston";

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.label({ label: "Prisma" }),
        winston.format.timestamp(),
        utilities.format.nestLike("Prismajon"),
        winston.format.printf(({ level, message, label, timestamp }) => {
          return `${timestamp} [${label}] ${level}: ${message}`;
        })
      ),
    }),
    new winston.transports.File({
      filename: "logs/combine.log",
      level: "info",
      format: winston.format.combine(
        winston.format.label({ label: "Prisma" }),
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: winston.format.combine(
        winston.format.label({ label: "Prisma" }),
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
};
