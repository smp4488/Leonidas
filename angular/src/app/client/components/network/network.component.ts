import { Component, OnInit } from '@angular/core';
import { ClientComponent } from '../../client.component';
import { WebSocketService } from '../../../web-socket.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {

  show: boolean;
  networkData: any = false;
  client: any;
  socket: any;
  chart: any = [];
  tx_sec: any = [100,50];
  rx_sec: any = [50,200];

  constructor(private clientComponent: ClientComponent, private webSocketService: WebSocketService) { }

  ngOnInit() { }

  ngOnDestroy() {
    if(this.socket) {
      this.socket.disconnect();
    }    
  }

  private initIoConnection(): void {
    this.webSocketService.onEvent('networkData', (data) => {
      this.networkData = data;
      this.tx_sec = [data.tx_sec, data.tx];
      this.rx_sec = [data.rx_sec, data.rx];
      this.chart.data.datasets[0].data = [data.tx_sec,100];
      this.chart.update();
    });
  }

  toggle() {
    if(!this.show){
      console.log('getting network data');
      this.client = this.clientComponent.getClient();
      this.socket = this.webSocketService.initSocket(this.client.host + '/network-data');
      console.log(this.client);
      this.setupChart();
      this.initIoConnection();      
    } else {
      if(this.socket) {
        this.socket.disconnect();
      }      
    }

    this.show = !this.show;
  }

  setupChart() {
    this.chart = new Chart('network-canvas', {
      type: 'doughnut',
      data: {
        labels: ['data','data'],
        datasets: [
          { 
            data: this.tx_sec,
            borderColor: "#3cba9f",
            fill: "#3cba9f"
          },
          // { 
          //   data: this.rx_sec,
          //   borderColor: "#ffcc00",
          //   fill: "#ffcc00"
          // },
        ]
      },
      options: {
        legend: {
          display: false
        },
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI
      }
    });

    console.log(this.chart);
  }
}
