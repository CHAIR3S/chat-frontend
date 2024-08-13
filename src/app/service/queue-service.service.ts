import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Mensaje } from '../interface/Mensaje';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private client: Client;

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:15674/ws', // URL del WebSocket de RabbitMQ
      connectHeaders: {
        login: 'guest',  // Cambia esto por el usuario de RabbitMQ si es diferente
        passcode: 'guest' // Cambia esto por la contraseña de RabbitMQ si es diferente
      },
      debug: (str) => {
        // console.log(new Date(), str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.client.onConnect = () => {
      console.log('Conectado a RabbitMQ WebSocket');
    };

    this.client.onStompError = (frame) => {
      console.error('Error en STOMP: ' + frame.headers['message']);
      console.error('Detalles: ' + frame.body);
    };

    this.client.activate();
  }

  sendMessageToExchange(exchange: string, routingKey: string, message: Mensaje) {
    this.client.publish({

      
      destination: `/exchange/${exchange}/${routingKey}`, // Formato para enviar a un exchange en RabbitMQ
      body: JSON.stringify(message)
    });
  }
}
