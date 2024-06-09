import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./app.module";
import { ConfigService } from "../config/config.service";
import * as winston from "winston";
import * as rotateFile from "winston-daily-rotate-file";

describe("AppModule", () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn().mockImplementation((key: string) => {
          switch (key) {
            case "DB_URL":
              return "mongodb://localhost/test";
            case "WEBTOKEN_SECRET_KEY":
              return "secretKey";
            default:
              return null;
          }
        }),
        isEnv: jest.fn().mockImplementation((env: string) => env === "dev"),
      })
      .compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(configService).toBeDefined();
  });

  it("should return correct mongoose configuration", async () => {
    const mongooseModuleOptions = {
      uri: "mongodb://localhost/test",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    expect(configService.get("DB_URL")).toEqual(mongooseModuleOptions.uri);
  });

  it("should return correct winston configuration for dev environment", () => {
    const winstonConfig = {
      level: "info",
      format: winston.format.json(),
      defaultMeta: { service: "user-service" },
      transports: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      ],
    };

    expect(configService.isEnv("dev")).toBe(true);
    expect(winstonConfig.level).toEqual("info");
    expect(winstonConfig.transports.length).toEqual(1);
  });

  it("should return correct winston configuration for production environment", () => {
    configService.isEnv = jest.fn().mockReturnValue(false);

    const winstonConfig = {
      level: "info",
      format: winston.format.json(),
      defaultMeta: { service: "user-service" },
      transports: [
        new winston.transports.File({
          filename: "logs/error.log",
          level: "error",
        }),
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
        new rotateFile({
          filename: "logs/application-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
        }),
      ],
    };

    expect(configService.isEnv("dev")).toBe(false);
    expect(winstonConfig.level).toEqual("info");
    expect(winstonConfig.transports.length).toEqual(3);
  });
});
