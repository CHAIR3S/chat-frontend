import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { Chat } from '../../../interface/Mensaje';

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [],
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.css'
})
export class ChatCardComponent {

  @Input({required: true}) idChat: number = 0;
  @Input({required: true}) nombre: string = '';
  @Input({required: true}) mensaje: string = '';

  
  change = output<number>()


  randomColor: string = '';

  ngOnInit(): void {
    this.randomColor = this.getRandomColor();
  }



  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  changeChat() {
    // console.log('cambio de chat: ', this.idChat)
    this.change.emit(this.idChat);
  }

}
