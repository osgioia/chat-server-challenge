import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../message/message.service';
import { Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from '../winston/winston.constants';
import { ConfigService } from '../config/config.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Permitir todas las solicitudes de origen
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly messageService: MessageService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}

  afterInit() {
    const port = this.configService.getWebSocketPort();
    this.server.listen(port); // Configura el puerto dinámico
    this.logger.log('info', `WebSocket server initialized on port ${port}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('info', `Client id: ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log('info', `Client id: ${client.id} disconnected`);
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket, data: any) {
    this.logger.log('info', `Message received from client id: ${client.id}`);
    this.logger.debug('debug', `Payload: ${data}`);
    client.emit('pong', 'Pong!'); // Enviar un mensaje de respuesta al cliente
  }

  @SubscribeMessage('messages')
  async handleMessage(client: Socket, data: any): Promise<void> {
    const { sender, content } = data;
    const message = await this.messageService.create(sender, content);
    this.server.emit('message', message); // Enviar el mensaje a todos los clientes conectados
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(client: Socket): Promise<void> {
    const messages = await this.messageService.findAll();
    client.emit('messages', messages); // Enviar los mensajes al cliente que solicita los mensajes
  }
}
