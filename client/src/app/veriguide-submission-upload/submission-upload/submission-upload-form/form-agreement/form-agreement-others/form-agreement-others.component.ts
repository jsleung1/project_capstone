import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-form-agreement-others',
  templateUrl: './form-agreement-others.component.html',
  styleUrls: ['../form-agreement.component.css', '../../../submission-upload.component.scss']
})
export class FormAgreementOthersComponent implements OnInit {
  @Input() fg: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
