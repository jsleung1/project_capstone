import { UserService } from 'src/app/veriguide-user-service/user-service';
import { LoggedInUser } from '../../../veriguide-model/loggedInUser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Submission } from 'src/app/veriguide-model/rest-api-response/Submission';
import { ActivatedRoute, Router } from '@angular/router';
import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { AlertDialogService } from '../../dialog/alert-dialog/alert-dialog-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UpdateSubmissionRequest } from 'src/app/veriguide-model/rest-api-request/submission/UpdateSubmissionRequest';
import { Subscription } from 'rxjs';
import { AssignmentsSubmissionsDTO } from 'src/app/veriguide-model/assignmentsSubmissionsDTO';

@Component({
  selector: 'app-submissions-history',
  templateUrl: './submissions-history.component.html',
  styleUrls: ['./submissions-history.component.scss']
})
export class SubmissionsHistoryComponent implements OnInit, OnDestroy {

  private title = '';
  private assignmentIdParam: string;
  private assignmentId = '';
  private submissions: Submission[];
  private subscription: Subscription;
  private loggedInUser: LoggedInUser;

  constructor(
    private activatedRoute: ActivatedRoute,
    private veriguideHttpClient: VeriguideHttpClient,
    private alertDialogService: AlertDialogService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService  ) {

    this.subscription = this.userService.getLoggedInUser().subscribe( loggedInUser => {
      this.loggedInUser = loggedInUser;
    });

    this.activatedRoute.data.subscribe( data => {
      this.assignmentIdParam = this.route.snapshot.paramMap.get('assignmentId');
      this.assignmentId = this.assignmentIdParam;
      
      const assignmentsSubmissionsDTO: AssignmentsSubmissionsDTO = data.resolverService;

      if ( this.assignmentId === '0') {
        this.title = `<i class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;&nbsp;Viewing <b>Student Submissions</b> uploaded to <b>All</b> of <b>My Assignments</b>`;
      } else if ( this.assignmentId === 'all') {
        this.title = '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;&nbsp;Viewing <b>My Submissions Upload History</b>';
      } else {
        const assignment = assignmentsSubmissionsDTO.assignments[0]
        const assignmentName = assignment.assignmentName;
        this.title = `<i class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;&nbsp;Viewing <b>Student Submissions</b> uploaded to <b>${ assignmentName }</b>`;
      }

      this.submissions = assignmentsSubmissionsDTO.submissions;
      this.submissions.forEach( submission => {
        const d = new Date( submission.createdAt ); 
        submission.uploadDateTime = d.toLocaleString(); 
        if ( submission.studentScore === undefined ) {
          submission.studentScoreStr = '--'
        } else {
          submission.studentScoreStr = submission.studentScore.toString();
        }
        submission.origInstructorComments = submission.instructorComments;
        submission.origStudentScore = submission.studentScore;
        submission.origStudentReferences = submission.studentReferences;
        
      })
    });
  }

  ngOnInit() {
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

  async onUpdateSubmission(submission: Submission, saveMode: string, message: string) {
    
    let updateSubmissionRequest: UpdateSubmissionRequest;
    
    if ( saveMode === 'score') {
      updateSubmissionRequest = {
        instructorComments: submission.origInstructorComments,
        studentScore: submission.studentScore,
        studentReferences: submission.origStudentReferences
      };
    }

    if ( saveMode === 'instructorComments') {
      updateSubmissionRequest = {
        instructorComments: submission.instructorComments,
        studentScore: submission.origStudentScore,
        studentReferences: submission.origStudentReferences
      };
    }

    if ( saveMode === 'studentReferences') {
      updateSubmissionRequest = {
        instructorComments: submission.origInstructorComments,
        studentScore: submission.origStudentScore,
        studentReferences: submission.studentReferences
      };
    }

    console.log( JSON.stringify(updateSubmissionRequest) );

    this.spinner.show();
    const updatedSubmission = await this.veriguideHttpClient.patch(`submissions/${submission.submissionId}`, updateSubmissionRequest ).toPromise();
    this.spinner.hide();
    this.alertDialogService.openDialog({
      title: 'Update Submission',
      message,
      dialogType: 'OKDialog' 
    }); 
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
