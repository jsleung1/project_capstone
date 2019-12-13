import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { ListCellDTO } from 'src/app/veriguide-model/models';

@Component({
  selector: 'app-list-cell-grid',
  templateUrl: './list-cell-grid.component.html',
  styleUrls: ['./list-cell-grid.component.css']
})
export class ListCellGridComponent implements AgRendererComponent, OnInit  {

  private record: ListCellDTO;

  constructor() { }

  ngOnInit() {
  }

  refresh(params: any): boolean {
    return true;
  }

  agInit(params: ICellRendererParams): void {
     const readProperty = params.value.getPropertyName;
     this.record = Reflect.get( params.data, readProperty );
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
  }
}
