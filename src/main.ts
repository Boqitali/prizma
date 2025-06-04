import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConsoleLogger, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { WinstonLogger, WinstonModule } from "nest-winston";
import { winstonConfig } from "./common/logger/winston.logger";
import { AllExceptionFilter } from "./common/error/error.handling";

async function start() {
  try {
    const PORT = process.env.PORT || 3030;
    const app = await NestFactory.create(AppModule, {
      logger: WinstonModule.createLogger(winstonConfig),
      
    });
    app.useGlobalFilters(new AllExceptionFilter())
    app.use(cookieParser());

    // app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix("api");

    await app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
