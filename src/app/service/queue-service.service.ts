import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  private rabbit = new Connection('amqp://guest:guest@localhost:5672')
  private pub: any;

  constructor() {
    this.initializeConnection();
    this.createPublisher();
   }


  initializeConnection() {
    this.rabbit.on('error', (err) => {
      console.log('RabbitMQ connection error', err)
    })
    this.rabbit.on('connection', () => {
      console.log('Connection successfully (re)established')
    })
  }

  createPublisher() {
    this.pub = this.rabbit.createPublisher({
      // Enable publish confirmations, similar to consumer acknowledgements
      confirm: true,
      // Enable retries
      maxAttempts: 2,
      // Optionally ensure the existence of an exchange before we use it
      exchanges: [{exchange: 'my-events', type: 'topic'}]
    })
  }


  async publishMessage(){
    await this.pub.send(
      {exchange: 'CHAT_EXCHANGE'}, // metadata
      {id: 1, name: 'Alan Turing'}) // message content
    
    // Or publish directly to a queue
    // await this.pub.send('user-events', {id: 1, name: 'Alan Turing'})
 
  }


  // Clean up when you receive a shutdown signal
  async onShutdown() {
    // Waits for pending confirmations and closes the underlying Channel
    await this.pub.close()
    await this.rabbit.close()
  }


}
