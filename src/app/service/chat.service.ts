import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Mensaje, Chat, ChatMensajes } from '../interface/Mensaje';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatComponent } from '../chat/chat.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient!: Client;
  public messages: Mensaje[] = [];
  public chats: Chat[] = [];
  public chatMensajes: ChatMensajes[] = [];
  public chatAct: any;
  private urlController: string = 'http://localhost:8080/conversaciones/';
  


  constructor(
    private http: HttpClient) {

  }


  connectToChanel(chats: number[]) {

    console.log('conectand al canal')
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/chat-websocket'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connected: ' + frame);

      chats.map(idChat => {
        this.subscribeToMessages(idChat);
      })
    };

    this.stompClient.activate();
  }


  subscribeToMessages(idChat: number) {
    this.stompClient.subscribe(`/topic/messages/${idChat}`, (message: any) => {
      let mensajesObtenidos: Mensaje[] = [];
      mensajesObtenidos = JSON.parse(message.body);
      
      if(mensajesObtenidos.length > 0){
        // console.log(mensajesObtenidos)


        const chatMensajesObtenidos: ChatMensajes[] = [];
  

        const indice = this.chatMensajes.findIndex(chat => chat.idChat == idChat);

        // console.log(this.chatMensajes)
        
        
        chatMensajesObtenidos.push(
          {
            idChat: idChat,
            mensajes: mensajesObtenidos
          })

          
          
          if((this.chatMensajes[indice].mensajes.length != chatMensajesObtenidos[0].mensajes.length)){
            console.log('Se actualiza chat')
            // this.chatMensajes[indice].mensajes = chatMensajesObtenidos[0].mensajes;
            this.chatMensajes[indice] = { ...this.chatMensajes[indice], mensajes: chatMensajesObtenidos[0].mensajes };

            if(this.chatAct == this.chatMensajes[indice].idChat)
              this.messages = chatMensajesObtenidos[0].mensajes;
          }
      }

        


      
    });
    
    //SOlo se ejecuta una vez, envia el id del chat al backend web socket
    this.sendChatId(idChat); 
  }

  sendChatId(idChat: number) {
    // console.log('publicando ejecutando metodo')
    this.stompClient.publish({destination: `/app/chat/${idChat}`, body: String(idChat)});
  }


  obtenerChatsPorUsuario(idUsuario: number): Observable<Chat[]>{
    return this.http.get<Chat[]>(this.urlController + idUsuario);
  }



}
