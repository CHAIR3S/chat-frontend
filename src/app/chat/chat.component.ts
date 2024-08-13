import { Component, ElementRef, ViewChild } from '@angular/core';
import { WebsocketService } from '../service/WebSocketService';
import { QueueService } from '../service/queue-service.service';
import { ChatService } from '../service/chat.service';
import { Chat, Mensaje } from '../interface/Mensaje';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageComponent } from "./component/message/message.component";
import { Form, FormsModule } from "@angular/forms"
import { ChatCardComponent } from './component/chat-card/chat-card.component';
import { consumerMarkDirty } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, RouterLink, MessageComponent, ChatComponent, FormsModule, ChatCardComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {


  messageInput: any;
  idUser: number = 0;
  message: string = '';
  chatsIds: number[] = [];
  public chatActual: number = 0;

  constructor(
    private queueService: QueueService,
    public chatService: ChatService,
    private route: ActivatedRoute
  ) {

    route.params.subscribe(params => {
      this.idUser = params['id'];

    })

  }

  ngOnInit(): void {
    
    this.chatService.obtenerChatsPorUsuario(this.idUser).subscribe(chats => {
      this.chatService.chats = chats;


      

      this.chatService.chats.map(chat => {
        this.chatsIds.push(chat.idChat);
      
        this.chatService.chatMensajes.push(
          {
            idChat: chat.idChat,
            mensajes: []
          })
      })


      
    
      this.chatService.connectToChanel(this.chatsIds);

    })

  }


 ngOnDestroy() {
  this.disconnectSocket();
 }



 // Método que se ejecuta al presionar Enter
 onEnterPress(event: any) {
   if (!event.shiftKey) {
     event.preventDefault(); // Prevenir el salto de línea

     //Enviar mensaje a socket
      this.sendMessageSocket(); 
    }
  }



  sendMessageSocket(): void {



    if (this.message.trim()) {

      const messageToSend: Mensaje = {
        idMensaje: 0,
        chatId: this.chatActual,
        emisorId: this.idUser,
        mensaje: this.message.trim(),
        fechaHora: new Date()
      };


      console.log('Mensaje enviado:', messageToSend);


      const exchange = 'CHAT_EXCHANGE'; // Nombre del exchange configurado en RabbitMQ
      const routingKey = 'CHAT_QUEUE';  // La clave de enrutamiento usada en la configuración

      this.queueService.sendMessageToExchange(exchange, routingKey, messageToSend);
      console.log('Mensaje enviado:', messageToSend);

      // Limpiar textarea
      this.message = ''; 
    }


  }



  
  disconnectSocket() {
  }


 subscribeSocket(){
  console.log('subscribesocket')
  const idChat = 1; // El idChat que quieras consultar
  this.chatService.subscribeToMessages(idChat);
 }

 changeChat($event: number){

  this.chatActual = $event
  this.chatService.chatAct = this.chatActual;

  console.log('nuevo evento ' + $event)

  const index = this.chatService.chatMensajes.findIndex(chat => chat.idChat == $event)


  console.log(this.chatService.chatMensajes)
  if(this.chatService.chatMensajes[index])
    this.chatService.messages = this.chatService.chatMensajes[index].mensajes;

 }



 obtenerUltimoMensaje(idChat: number): string{

  const index = this.chatService.chatMensajes.findIndex(chat => chat.idChat == idChat)

  if(this.chatService.chatMensajes[index].mensajes.length != 0)
    return this.chatService.chatMensajes[index].mensajes[this.chatService.chatMensajes[index].mensajes.length-1].mensaje;
  else
    return '*No hay mensajes aún*'

 }

}
