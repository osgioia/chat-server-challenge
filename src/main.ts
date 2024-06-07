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
import { WsAdapter } from '@nestjs/platform-ws';

(async () => {
  // Crear la aplicación principal en el puerto 9000
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
  
  // Iniciar la aplicación principal en el puerto 9000
  await app.listen(port, "0.0.0.0");

  const logger = app.get(WINSTON_MODULE_PROVIDER);
  logger.log("info", `REST server is running on port ${port}`);

  // Crear y configurar el servidor WebSocket en el puerto 3001
  const wsApp = await NestFactory.create(AppModule, new FastifyAdapter());
  wsApp.useWebSocketAdapter(new WsAdapter(wsApp));
  await wsApp.listen(3001);
  console.log('WebSocket server is running on port 3001');
})();
