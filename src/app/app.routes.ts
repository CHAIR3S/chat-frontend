import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
    {path: 'chat/:id', component: ChatComponent},
    {path: '', redirectTo: '/chat/1', pathMatch: 'full' },
    {path: '**', redirectTo: '/chat/1', pathMatch: 'full' }

];
