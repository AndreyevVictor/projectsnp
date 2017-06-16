import * as d3 from '../shared/helpers/d3.export'
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  title: string = `Menu`;
  isActive: number = 0;

  constructor() { }

  ngOnInit() {
  }

}
