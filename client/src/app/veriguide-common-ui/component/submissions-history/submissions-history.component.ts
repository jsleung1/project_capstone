import { Component, OnInit } from '@angular/core';
import { Submission } from 'src/app/veriguide-model/rest-api-response/Submission';
import { ActivatedRoute, Router } from '@angular/router';
import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { AlertDialogService } from '../../dialog/alert-dialog/alert-dialog-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Student } from 'src/app/veriguide-model/rest-api-response/User';

@Component({
  selector: 'app-submissions-history',
  templateUrl: './submissions-history.component.html',
  styleUrls: ['./submissions-history.component.scss']
})
export class SubmissionsHistoryComponent implements OnInit {

  private title = '';
  private submissions: Submission[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private veriguideHttpClient: VeriguideHttpClient,
    private alertDialogService: AlertDialogService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router  ) {

    const viewType = this.route.snapshot.paramMap.get('queryId');
    if ( viewType === Student) {
      this.title = '<i class="fa fa-tasks" aria-hidden="true"></i>&nbsp;Viewing <b>Student Submissions Upload History</b>';
    } else {
      this.title = '<i class="fa fa-tasks" aria-hidden="true"></i>&nbsp;Viewing <b>Student Submissions</b> uploaded to the <b>Assignment</b>';
    }

    this.activatedRoute.data.subscribe( data => {
      this.submissions = data.resolverService;
      console.log( JSON.stringify( this.submissions ) );
    });
  }

  ngOnInit() {
  }

}
