import { Component, OnInit } from '@angular/core';
import { Submission } from 'src/app/veriguide-model/rest-api-response/Submission';
import { ActivatedRoute, Router } from '@angular/router';
import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { AlertDialogService } from '../../dialog/alert-dialog/alert-dialog-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Student } from 'src/app/veriguide-model/rest-api-response/User';
import { Assignment } from 'src/app/veriguide-model/rest-api-response/Assignment';

@Component({
  selector: 'app-submissions-history',
  templateUrl: './submissions-history.component.html',
  styleUrls: ['./submissions-history.component.scss']
})
export class SubmissionsHistoryComponent implements OnInit {

  private title = '';
  private viewType = '';
  private submissions: Submission[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private veriguideHttpClient: VeriguideHttpClient,
    private alertDialogService: AlertDialogService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router  ) {

    this.viewType = this.route.snapshot.paramMap.get('assignmentId');


    this.activatedRoute.data.subscribe( data => {
      this.submissions = data.resolverService;
      console.log( JSON.stringify( this.submissions ) );
    });
  }

  async ngOnInit() {
    if ( this.viewType === 'all') {
      this.title = '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;&nbsp;Viewing <b>My Submissions Upload History</b>';
    } else {
      const assignmentId = this.viewType;
      const assignment = await this.veriguideHttpClient.get(`assignment/${assignmentId}`).toPromise() as Assignment;

      let assignmentName;
      if ( assignment ) {
        assignmentName = assignment.assignmentName;
      } else {
        assignmentName = '';
      }
      this.title = `<i class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;&nbsp;Viewing <b>Student Submissions</b> uploaded to <b>${ assignmentName }</b>`;
    }

  }

}
