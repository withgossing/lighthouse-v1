import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*', // In production, restrict this to the frontend domain
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @MessageBody() room: string,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(room);
        console.log(`Client ${client.id} joined room ${room}`);
        return { event: 'joinedRoom', data: room };
    }

    @SubscribeMessage('sendMessage')
    handleMessage(
        @MessageBody() payload: { room: string; message: string; sender: string },
        @ConnectedSocket() client: Socket,
    ) {
        // Broadcast to everyone in the room except the sender
        client.to(payload.room).emit('newMessage', payload);
        return { event: 'messageSent', data: payload };
    }

    // --- WebRTC Signaling ---

    @SubscribeMessage('offer')
    handleOffer(
        @MessageBody() payload: { room: string; offer: any },
        @ConnectedSocket() client: Socket,
    ) {
        client.to(payload.room).emit('offer', payload.offer);
    }

    @SubscribeMessage('answer')
    handleAnswer(
        @MessageBody() payload: { room: string; answer: any },
        @ConnectedSocket() client: Socket,
    ) {
        client.to(payload.room).emit('answer', payload.answer);
    }

    @SubscribeMessage('ice-candidate')
    handleIceCandidate(
        @MessageBody() payload: { room: string; candidate: any },
        @ConnectedSocket() client: Socket,
    ) {
        client.to(payload.room).emit('ice-candidate', payload.candidate);
    }
}
