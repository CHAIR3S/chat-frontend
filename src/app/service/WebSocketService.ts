import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import { Client, StompConfig } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private stompClient!: Client;
  private urlConnection = 'ws://localhost:8090/chats/websocket';


  constructor(){
    this.initConnectionSocket();
  }


  initConnectionSocket() {

    // const socket = SockJS(this.urlConnection);
    // this.stompClient = Stomp.over(socket);
    // console.log(this.stompClient)

    


    this.stompClient = new Client({
      brokerURL: this.urlConnection,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log(new Date(), str);
      },
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
        this.joinRoom("1");
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      onWebSocketClose: () => {
        console.log('WebSocket closed');
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error: ', error);
      },
    });

    this.stompClient.activate();
  }


  joinRoom (roomId: any) {
    // this.stompClient.connect({}, () => {
    //   this.stompClient.subscribe(`/topic/canal1`, (messages: any) => {
    //     const messageContent = JSON.parse(messages.body);
    //     console.log(messageContent);
    //   })
    // }, (error: any) => {
    //   console.error('Connection error: ' + error);
    // })
    



    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.subscribe('/topic/canal1', (message) => {
        console.log('Received message:', JSON.parse(message.body));
      });
    } else {
      console.error('STOMP client is not connected.');
    }
  
  }

  // sendMessage(chatId: any, message: any) {
  //   // this.stompClient.send(`/app/chat1`, {}, JSON.stringify(message));

  //   if (this.stompClient && this.stompClient.connected) {
  //     this.stompClient.send(`/app/chat1`, {}, JSON.stringify(message));
  //   } else {
  //     console.error('Cannot send message. STOMP client is not connected.');
  //   }
  // }
  sendMessage(chatId: any, message: any) {

    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/chat1`,
        body: JSON.stringify(message)
      });
    } else {
      console.error('Cannot send message. STOMP client is not connected.');
    }
  }

}