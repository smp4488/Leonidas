import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'show-hide',
  templateUrl: './show-hide.component.html',
  styleUrls: ['./show-hide.component.scss']
})
export class ShowHideComponent implements OnInit {

  show: boolean;

  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.show = !this.show;
  }

}
