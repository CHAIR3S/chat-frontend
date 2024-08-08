import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class webSocketService {
  private webSocket: Socket;

  constructor() {
    this.webSocket = new Socket({
      url: 'http://localhost:8090', // Cambia la URL a la del backend donde está corriendo tu servidor Spring Boot
      options: {
        transports: ['websocket'], // Especifica el transporte websocket
        path: '/chats/websocket', // Especifica el path del WebSocket
      },
    });
  }

  // Inicia la conexión del socket
  connectSocket(): void {
    this.webSocket.connect();
  }

  // Envía un mensaje al servidor
  sendMessage(destination: string, message: any): void {
    this.webSocket.emit(destination, message);
  }

  // Recibe mensajes desde el servidor
  receiveStatus(): Observable<any> {
    return this.webSocket.fromEvent('/topic/chat1');
  }

  // Desconecta el socket
  disconnectSocket(): void {
    this.webSocket.disconnect();
  }
}
