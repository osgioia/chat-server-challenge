import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatGateway } from "./chat.gateway";
import { MessageService } from "../message/message.service";
import { Message, MessageSchema } from "../message/message.model";
import { ConfigModule } from "../config/config.module";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [ChatGateway, MessageService],
})
export class ChatModule {}
