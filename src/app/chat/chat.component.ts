import { Component } from '@angular/core';
import { WebsocketService } from '../service/WebSocketService';
import { QueueService } from '../service/queue-service.service';
import { ChatService } from '../service/chat.service';
import { Mensaje } from '../interface/Mensaje';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageComponent } from "./component/message/message.component";
import { Form, FormsModule } from "@angular/forms"

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, RouterLink, MessageComponent, ChatComponent, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {


  messageInput: any;
  idUser: number = 0;



  message: string = '';

  constructor(
    private wsService: WebsocketService,
    private queueService: QueueService,
    public chatService: ChatService,
    private route: ActivatedRoute
  ) {

    route.params.subscribe(params => {
      this.idUser = params['id'];

    })

  }

  ngOnInit(): void {
    // this.initializeSocketConnection();

    // const idChat = 1; // El idChat que quieras consultar
    // this.chatService.subscribeToMessages(idChat); // Suscríbete a los mensajes
    // this.chatService.sendChatId(idChat); // Envía el idChat al servidor

    // const message: Mensaje = {
    //   idMensaje: 1,
    //   chatId: 1,
    //   emisorId: 1,
    //   mensaje: 'Hola rabbit',
    //   fechaHora: new Date()
    // };
    // this.messages.push(message)

    this.initializeSocketConnection();
  }


 ngOnDestroy() {
  this.disconnectSocket();
 }



  sendMessage() {
     if (this.message.trim()) {
       console.log('Mensaje enviado:', this.message);
       // Aquí puedes agregar el código para enviar el mensaje
       this.message = ''; // Limpiar el textarea después de enviar el mensaje
     }
   }

 // Método que se ejecuta al presionar Enter
 onEnterPress(event: any) {
   if (!event.shiftKey) {
     event.preventDefault(); // Prevenir el salto de línea
      this.sendMessageSocket(); // Ejecutar la función de envío de mensaje
    }
  }



  sendMessageSocket(): void {


    // this.wsService.sendMessage("1", message)

    if (this.message.trim()) {

      const messageToSend: Mensaje = {
        idMensaje: 0,
        chatId: 1,
        emisorId: this.idUser,
        mensaje: this.message.trim(),
        fechaHora: new Date()
      };


      console.log('Mensaje enviado:', messageToSend);


      const exchange = 'CHAT_EXCHANGE'; // Nombre del exchange configurado en RabbitMQ
      const routingKey = 'CHAT_QUEUE';  // La clave de enrutamiento usada en la configuración
      this.queueService.sendMessageToExchange(exchange, routingKey, messageToSend);
      console.log('Mensaje enviado:', messageToSend);


      this.message = ''; // Limpiar el textarea después de enviar el mensaje
    }


  }


  initializeSocketConnection(): void {
    this.wsService.stompClient.subscribe('/topic/canal1', (message) => {
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
