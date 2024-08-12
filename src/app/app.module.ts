

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'ws://localhost:8090/chats/websocket', options: {} };


@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        HttpClientModule,
        SocketIoModule.forRoot(config)
    ],
    providers: [SocketIoModule]
})
export class AppModule{

}