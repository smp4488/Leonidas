import { Component, OnInit } from '@angular/core';
import { ClientComponent } from '../../client.component';
import { WebSocketService } from '../../../web-socket.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.scss']
})
export class CpuComponent implements OnInit {

  show: boolean;
  cpuData: any = false;
  client: any;
  socket: any;
  chart: any = [];

  constructor(private clientComponent : ClientComponent, private webSocketService : WebSocketService, ) { }

  ngOnInit() { }

  ngOnDestroy() {
    if(this.socket) {
      this.socket.disconnect();
    }    
  }

  initSocketConnection() {
    this.webSocketService.onEvent('cpuData', (data) => {
      this.cpuData = data;
      this.chart.data.datasets[0].data = [data.currentload,100];
      this.chart.update();
    });
  }

  toggle() {
    if(!this.show){
      console.log('getting cpu data');
      this.client = this.clientComponent.getClient();
      this.socket = this.webSocketService.initSocket(this.client.host + '/cpu-data');
      console.log(this.client);
      this.setupChart();
      this.initSocketConnection();      
    } else {
      if(this.socket) {
        this.socket.disconnect();
      }
    }

    this.show = !this.show;
  }

  setupChart() {
    this.chart = new Chart('cpu-canvas', {
      type: 'doughnut',
      data: {
        labels: ['data','data'],
        datasets: [
          { 
            data: [0,100],
            borderColor: "#3cba9f",
            fill: "#3cba9f"
          }
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
