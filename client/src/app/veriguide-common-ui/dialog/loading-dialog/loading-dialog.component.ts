import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.css']
})
export class LoadingDialogComponent implements OnInit {

  constructor( private spinner: NgxSpinnerService ) {
  }

  ngOnInit() {
  }

}
