import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: Client;

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/chat-websocket'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connected: ' + frame);

      const idChat = 1; 
      this.subscribeToMessages(idChat);
    };

    this.stompClient.activate();

  }

  subscribeToMessages(idChat: number) {
    this.stompClient.subscribe(`/topic/messages/${idChat}`, (message: any) => {
      const chatMessages = JSON.parse(message.body);
      console.log(chatMessages); // Aquí puedes actualizar el estado en tu aplicación
      
    });
    this.sendChatId(idChat); // Envía el idChat al servidor
  }

  sendChatId(idChat: number) {
    console.log('publicando ejecutando metodo')
    this.stompClient.publish({destination: `/app/chat/${idChat}`, body: String(idChat)});
  }
}
