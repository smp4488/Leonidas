import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  clients: any;
  socket: any;

  constructor(private data: DataService, private webSocketService: WebSocketService) { 
    this.clients = [];
    this.data.getClients().subscribe(
      data => this.clients = data 
    );
  }

  ngOnInit() {
    this.initIoConnection();
  }

  ngOnDestroy() {
    //this.webSocketService.destroySocket();
    this.socket.disconnect();
  }

  private initIoConnection(): void {
    this.socket = this.webSocketService.initSocket(false);

    this.webSocketService.onEvent('connect', (data) => {
      console.log('web socket connected');
    });

    this.webSocketService.onEvent('disconnect', (data) => {
      console.log('web socket disconnected');
    });

    this.webSocketService.onEvent('client_disconnected', (data) => {
      console.log('client_disconnected', data);
      for (var i in this.clients) {
        if (this.clients[i].name == data) {
            this.clients.splice(i, 1);
        }
      }
    });

    this.webSocketService.onEvent('client_connected', (data) => {
      console.log('client_connected', data.name);
      this.clients.push(data);
    });
  }
}
