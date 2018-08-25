import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  client: any
  objectKeys = Object.keys;

  constructor(private data: DataService, private route: ActivatedRoute) { 
    this.route.params.subscribe( params => this.client = params.id );
    
    this.data.getClient(this.client).subscribe(
      data => {
        this.client = data;
        this.client.host = 'http://' + this.client.referer.address + ':' + this.client.port;
        this.data.getClientStaticData(this.client).subscribe(
          data => this.client.staticData = data
        );
      }
    );
  }

  ngOnInit() {
  
  }

  getClient() {
    return this.client;
  }

}
