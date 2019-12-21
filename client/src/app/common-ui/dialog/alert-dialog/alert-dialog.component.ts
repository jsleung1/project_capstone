import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() dialogType: string;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

}
