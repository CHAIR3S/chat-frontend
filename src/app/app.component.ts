import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { WebsocketService } from './service/WebSocketService';
import { QueueService } from './service/queue-service.service';
import { Mensaje } from './interface/Mensaje';
import { ChatService } from './service/chat.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  messageInput: any;
  title = 'chat-front';
  

  public messages: any[] = [];


  constructor(
    private wsService: WebsocketService,
    private queueService: QueueService,
    private chatService: ChatService
  ) {

    

  }

  ngOnInit(): void {
    // this.initializeSocketConnection();
    
    // const idChat = 1; // El idChat que quieras consultar
    // this.chatService.subscribeToMessages(idChat); // Suscríbete a los mensajes
    // this.chatService.sendChatId(idChat); // Envía el idChat al servidor
  }

  
 ngOnDestroy() {
  this.disconnectSocket();
 }


  imageUrl: string | null = null;
  fallbackSvg: string = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>`;



  sendMessage(messageInput: any) {
    if (messageInput.value) {
      this.messages.push({ user: 'You', message: messageInput.value, time: new Date().toLocaleTimeString(), own: true });
      messageInput.value = '';
    }
  }



  sendMessageSocket(): void {
    const message: Mensaje = {
      idMensaje: 0,
      chatId: 1,
      emisorId: 1,
      mensaje: 'Hola rabbit',
      fechaHora: new Date()
    };


    // this.wsService.sendMessage("1", message)
    
    const exchange = 'CHAT_EXCHANGE'; // Nombre del exchange configurado en RabbitMQ
    const routingKey = 'CHAT_QUEUE';  // La clave de enrutamiento usada en la configuración
    this.queueService.sendMessageToExchange(exchange, routingKey, message);
    console.log('Mensaje enviado:', message);

  }

  
  initializeSocketConnection(): void {
    this.wsService.joinRoom("1")

    this.wsService.stompClient.subscribe('/topic/canal1', (message) => {
      const receivedMessage = JSON.parse(message.body);
      this.messages.push({ 
        user: 'Server', 
        message: receivedMessage.texto, 
        time: new Date(receivedMessage.fecha).toLocaleTimeString(), 
        own: false 
      });

      console.log('recibiendo mensaje')
      console.log(this.messages)
    });
  }


  // Disconnects socket connection
  disconnectSocket() {
 }


 subscribeSocket(){
  console.log('subscribesocket')
  const idChat = 1; // El idChat que quieras consultar
  this.chatService.subscribeToMessages(idChat);
 }
}
