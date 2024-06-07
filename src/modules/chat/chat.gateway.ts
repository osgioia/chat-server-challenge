import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { MessageService } from "../message/message.service";
import { Logger } from '@nestjs/common'
import { Inject } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "../winston/winston.constants";
import { ConfigService } from "../config/config.service";

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit {
    @WebSocketServer() server: Server;

  constructor(private readonly messageService: MessageService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
      const wsPort = this.configService.getWebSocketPort()
      server.listen(wsPort)
      this.logger.log('info','WebSocket server initialized')
      this.logger.log('info',`WebSocket server is running on port ${wsPort}`)
  }

  @SubscribeMessage("message")
  async handleMessage(@MessageBody() data: any): Promise<void> {
    const { sender, content } = data;
    const message = await this.messageService.create(sender, content);
    this.server.emit("message", message);
  }

  @SubscribeMessage("getMessages")
  async handleGetMessages(): Promise<void> {
    const messages = await this.messageService.findAll();
    this.server.emit("messages", messages);
  }
}
