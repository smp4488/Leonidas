import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:3001';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket;

  constructor() { }

  public initSocket(url): any {
    url = url ? url : SERVER_URL;
    this.socket = socketIo(url);
    return this.socket;
  }

  public destroySocket(): any {
    this.socket.disconnect();
  }

  public onEvent(event,cb): any {
    this.socket.on(event, (data) => {
      cb(data);
    });
  }
}
