import { CommonModule, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [NgStyle, CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {

  @Input({required: true}) name = '';
  @Input({required: true}) id = 0;
  @Input({required: true}) message = '';
  @Input({required: true}) time = '';

  idUser = 0;


  constructor(route: ActivatedRoute) {
    route.params.subscribe(params => {
      this.idUser = params['id']
    })
  }



  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
  
    // Formato para la hora en AM/PM
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
  
    // Verificar si la fecha es de un día anterior
    const isDifferentDay = now.toDateString() !== date.toDateString();
  
    let formattedDate = date.toLocaleTimeString('es-ES', options);
  
    if (isDifferentDay) {
      const dayOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short', // Sáb
        month: 'short', // Ago
        day: 'numeric', // 10
      };
      formattedDate = `${date.toLocaleDateString('es-ES', dayOptions)} ${formattedDate}`;
    }
  
    return formattedDate;
  }
  


}
