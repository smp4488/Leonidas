import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getClients() {
    return this.http.get('http://localhost:3001/clients/');
  }

  getClient(id) {
    return this.http.get('http://localhost:3001/clients/'+ id);
  }

  getClientStaticData(client) {
    return this.http.get(client.host + '/static-data');
  }

  getNetworkData(client){
    return this.http.get(client.host + '/network-data');
  }
}
