import { Component, OnInit } from '@angular/core';
import { Submission } from 'src/app/veriguide-model/rest-api-response/Submission';
import { ActivatedRoute, Router } from '@angular/router';
import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { AlertDialogService } from '../../dialog/alert-dialog/alert-dialog-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Student } from 'src/app/veriguide-model/rest-api-response/User';
import { Assignment } from 'src/app/veriguide-model/rest-api-response/Assignment';
import { UpdateSubmissionRequest } from 'src/app/veriguide-model/rest-api-request/submission/UpdateSubmissionRequest';

@Component({
  selector: 'app-submissions-history',
  templateUrl: './submissions-history.component.html',
  styleUrls: ['./submissions-history.component.scss']
})
export class SubmissionsHistoryComponent implements OnInit {

  private title = '';
  private assignmentId = '';
  private submissions: Submission[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private veriguideHttpClient: VeriguideHttpClient,
    private alertDialogService: AlertDialogService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router  ) {

    this.assignmentId = this.route.snapshot.paramMap.get('assignmentId');

    this.activatedRoute.data.subscribe( data => {
      this.submissions = data.resolverService;
      this.submissions.forEach( submission => {
        const d = new Date( submission.createdAt ); 
        submission.uploadDateTime = d.toLocaleString(); 
        if ( submission.studentScore === undefined ) {
          submission.studentScoreStr = '--'
        } else {
          submission.studentScoreStr = submission.studentScore.toString();
        }
      })
    });
  }

  async ngOnInit() {
    if ( this.assignmentId === 'all') {
      this.title = '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;&nbsp;Viewing <b>My Submissions Upload History</b>';
    } else {
      
      this.spinner.show();
      const assignment = await this.veriguideHttpClient.get(`assignment/${this.assignmentId}`).toPromise() as Assignment;
      this.spinner.hide();

      let assignmentName;
      if ( assignment ) {
        assignmentName = assignment.assignmentName;
      } else {
        assignmentName = '';
      }
      this.title = `<i class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;&nbsp;Viewing <b>Student Submissions</b> uploaded to <b>${ assignmentName }</b>`;
    }

  }

  onToggleSubmissionComments(submission: Submission) {
      if ( submission.expandedInstructorComments === undefined || submission.expandedInstructorComments === false ) {
        submission.expandedInstructorComments = true;
      } else {
        submission.expandedInstructorComments = false;
      }
  }

  onToggleSubmissionReferences(submission: Submission) {
    if ( submission.expandedReferences === undefined || submission.expandedReferences === false ) {
      submission.expandedReferences = true;
    } else {
      submission.expandedReferences = false;
    }    
  }

  onWithdrawSubmission(submission: Submission) {
    this.alertDialogService.openDialog({
      title: 'Withdraw Submission',
      message: 'Are you sure you want to withdraw this submission?',
      dialogType: 'YesNoDialog'
    }).then( async res => {
      if ( res === 'YES') {
        this.spinner.show();
        const deletedSubmission = await this.veriguideHttpClient.delete(`submissions/${submission.submissionId}`).toPromise();
       
        let urlPath;
        if ( this.assignmentId !== 'all' ) {
          urlPath = `submissions/assignment/${this.assignmentId}`; // get submissons of the assignment
        } else {
          urlPath = `submissions`; // get submissions uploaded by user
        }

        this.submissions = await this.veriguideHttpClient.get<Array<Submission>>( urlPath ).toPromise();
        this.spinner.hide();

        this.alertDialogService.openDialog({
          title: 'Withdraw Submission',
          message: 'Successfully withdraw the submission.',
          dialogType: 'OKDialog' 
        });
      }
    });
  }

  async onUpdateSubmissionReferences(submission: Submission) {
    const updateSubmissionRequest: UpdateSubmissionRequest = {
      instructorComments: submission.instructorComments || null,
      studentScore: submission.studentScore || null,
      studentReferences: submission.studentReferences
    }
    console.log( JSON.stringify(updateSubmissionRequest) );

    this.spinner.show();
    const updatedSubmission = await this.veriguideHttpClient.patch(`submissions/${submission.submissionId}`, updateSubmissionRequest ).toPromise();
    this.spinner.hide();
    this.alertDialogService.openDialog({
      title: 'Update Submission',
      message: 'Successfully update the Submission References.',
      dialogType: 'OKDialog' 
    }); 
  }
}
