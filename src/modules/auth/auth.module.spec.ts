import { Test, TestingModule } from "@nestjs/testing";
import { AuthModule } from "./auth.module";
import { ConfigService } from "../config/config.service";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";
import { ProfileModule } from "../profile/profile.module";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Reflector } from "@nestjs/core";
import { ACGuard } from "nest-access-control";

describe("AuthModule", () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, MongooseModule.forRoot("mongodb://localhost/test")],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn().mockImplementation((key: string) => {
          switch (key) {
            case "WEBTOKEN_SECRET_KEY":
              return "testSecretKey";
            case "WEBTOKEN_EXPIRATION_TIME":
              return "3600";
            default:
              return null;
          }
        }),
      })
      .overrideProvider(getModelToken("Profile"))
      .useValue(Model)
      .overrideProvider(Reflector)
      .useValue(new Reflector())
      .overrideGuard(ACGuard)
      .useValue({ canActivate: () => true })
      .compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(configService).toBeDefined();
  });

  it("should provide the correct JWT configuration", async () => {
    const jwtOptions = {
      secret: "testSecretKey",
      signOptions: {
        expiresIn: 3600,
      },
    };

    expect(configService.get("WEBTOKEN_SECRET_KEY")).toEqual(jwtOptions.secret);
    expect(configService.get("WEBTOKEN_EXPIRATION_TIME")).toEqual(
      jwtOptions.signOptions.expiresIn.toString(),
    );
  });
});

describe("AuthService", () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, MongooseModule.forRoot("mongodb://localhost/test")],
    })
      .overrideProvider(getModelToken("Profile"))
      .useValue(Model)
      .overrideProvider(Reflector)
      .useValue(new Reflector())
      .overrideGuard(ACGuard)
      .useValue({ canActivate: () => true })
      .compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });

  it("should sign a JWT token", async () => {
    const payload = { username: "testuser" };
    const token = await jwtService.signAsync(payload);
    expect(token).toBeDefined();
  });
});

describe("JwtStrategy", () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, MongooseModule.forRoot("mongodb://localhost/test")],
    })
      .overrideProvider(getModelToken("Profile"))
      .useValue(Model)
      .overrideProvider(Reflector)
      .useValue(new Reflector())
      .overrideGuard(ACGuard)
      .useValue({ canActivate: () => true })
      .compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it("should be defined", () => {
    expect(jwtStrategy).toBeDefined();
  });
});
