import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from "./config.service";

@Module({
  imports: [NestConfigModule.forRoot({isGlobal: true})],
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(".env"),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
