import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { LabelUrlCellDTO } from 'src/app/veriguide-model/models';
import { Router, Route, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-labelurl-cell-grid',
  templateUrl: './labelurl-cell-grid.component.html',
  styleUrls: ['./labelurl-cell-grid.component.css']
})
export class LabelurlCellGridComponent implements AgRendererComponent, OnInit  {

  private record: LabelUrlCellDTO;

  refresh(params: any): boolean {
    return true;
  }
  agInit(params: ICellRendererParams): void {
    const readProperty = params.value.getPropertyName;
    this.record = Reflect.get( params.data, readProperty );
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
  }

  constructor( private router: Router,
               private route: ActivatedRoute  ) { }

  ngOnInit() {
  }

  navigateToLink() {
    this.router.navigate( [ this.record.labelUrlLink ], { relativeTo: this.route } );
  }

}
