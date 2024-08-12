export interface Mensaje {
    idMensaje: number;
    chatId:    number;
    emisorId:  number;
    mensaje:   string;
    fechaHora: Date;
}


export interface Usuario {
    idUsuario: number;
    nombre:    string;
}


export interface Viaje {
    idViaje:   number;
    conductor: Usuario;
    cliente:   Usuario;
}



export interface Chat {
    idChat:    number;
    viaje:     Viaje;
    idUsuario: number;
}



export interface ChatMensajes{
    idChat: number;
    mensajes: Mensaje[]
}

