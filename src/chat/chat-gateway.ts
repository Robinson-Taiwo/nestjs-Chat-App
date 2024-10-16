import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3002, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from your frontend
    credentials: true,
  },
})
export class chatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('New user connected', client.id);
    client.emit('reply', {
      message: 'You have joined the chat!',
    });
    client.broadcast.emit('reply', {
      message: `New user joined the chat: ${client.id}`,
    });
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected', client.id);
    this.server.emit('reply', {
      message: `User left the chat: ${client.id}`,
    });
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(@MessageBody() message: string) {
    console.log('Received message:', message); // Log the received message
    this.server.emit('message', message);
  }
}
