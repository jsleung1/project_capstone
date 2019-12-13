import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import * as fieldsAssignmentInfo from '../../form-assignment-information/form-assignment-information.fields';

@Component({
  selector: 'app-form-agreement-cuhk',
  templateUrl: './form-agreement-cuhk.component.html',
  styleUrls: ['../form-agreement.component.css', '../../../submission-upload.component.scss']
})
export class FormAgreementCUHKComponent implements OnInit {
  @Input() fg: FormGroup;
  isIndividual = false;
  isGroup = false;

  constructor() {
  }

  ngOnInit() {
    const valType = String(this.fg.get(fieldsAssignmentInfo.namesFieldItems.sType).value);
    this.isIndividual = valType === 'I';
    this.isGroup = valType === 'G';
  }

}
