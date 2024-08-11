import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Mensaje } from '../interface/Mensaje';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: Client;
  public messages: Mensaje[] = [];

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
      const chatMessages: Mensaje[] = JSON.parse(message.body);

      console.log(chatMessages); // Aquí puedes actualizar el estado en tu aplicación

      if(this.messages.length != chatMessages.length ){
        console.log('Se actualiza chat')
        this.messages = chatMessages
      }
      
    });
    
    //SOlo se ejecuta una vez, envia el id del chat al backend web socket
    this.sendChatId(idChat); 
  }

  sendChatId(idChat: number) {
    console.log('publicando ejecutando metodo')
    this.stompClient.publish({destination: `/app/chat/${idChat}`, body: String(idChat)});
  }
}
