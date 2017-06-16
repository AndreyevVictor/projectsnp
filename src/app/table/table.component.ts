import { Component, OnInit } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser'
import { Table } from "../shared/interfaces/table.interface";
import {  TableData  } from '../shared/models/temp/table.data';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  private tableData:Table[] = TableData;
  constructor() {
  }
  ngOnInit() {
  }
}
