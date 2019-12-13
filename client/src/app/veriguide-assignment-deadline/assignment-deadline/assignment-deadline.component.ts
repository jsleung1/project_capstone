import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {VeriguideAssignmentDeadlineService} from '../veriguide-assignment-deadline.service';

export interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-assignment-deadline',
  templateUrl: './assignment-deadline.component.html',
  styleUrls: ['./assignment-deadline.component.scss']
})
export class AssignmentDeadlineComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly alertsMessages: {[key: string]: Alert} = {
    createSuccess: {
      type: 'success',
      message: 'The deadline record is created successfully!'
    },
    createFailed: {
      type: 'danger',
      message: 'The deadline record cannot be created, please try again later.'
    }
  };

  constructor(private sAsgnDeadline: VeriguideAssignmentDeadlineService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

}
