import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { RedisStore } from "connect-redis";
import cookieParser from "cookie-parser";
import session from "express-session";
import IORedis from "ioredis";
import ms from "ms";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const redis = new IORedis({
    host: config.getOrThrow("REDIS_HOST"),
    port: config.getOrThrow<number>("REDIS_PORT"),
    password: config.getOrThrow<string>("REDIS_PASSWORD"),
  });

  app.use(cookieParser(config.getOrThrow<string>("COOKIES_SECRET")));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(
    session({
      secret: config.getOrThrow<string>("SESSION_SECRET"),
      name: config.getOrThrow<string>("SESSION_NAME"),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>("SESSION_DOMAIN"),
        maxAge: ms(config.getOrThrow<string>("SESSION_MAX_AGE")),
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow<string>("SESSION_FOLDER"),
      }),
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>("ALLOWED_ORIGIN"),
    credentials: true,
    exposedHeaders: ["set-cookie"],
  });
  await app.listen(config.getOrThrow<number>("PORT"));
}

bootstrap();
