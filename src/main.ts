import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./modules/app/app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ConfigService } from "./modules/config/config.service";
import { WINSTON_MODULE_PROVIDER } from "./modules/winston/winston.constants";
import { ClusterService } from './modules/cluster/cluster.service';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  const configService = app.get(ConfigService);
  const port = configService.getPort();
  const options = new DocumentBuilder()
    .setTitle("API")
    .setDescription("API Description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api/docs", app, document);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, "0.0.0.0");

  const logger = app.get(WINSTON_MODULE_PROVIDER);
  logger.log("info", `REST server is running on port ${port}`);

  const wsPort = configService.getWebSocketPort();

  logger.log("info",`WebSocket server is running on port ${wsPort}`);
};
ClusterService.clusterize(bootstrap);
