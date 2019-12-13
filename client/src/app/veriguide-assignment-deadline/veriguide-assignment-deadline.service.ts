import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {NgbDate, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import {AcadYearDTO} from '../veriguide-model/server-model/acadYearDTO';
import {TermDTO} from '../veriguide-model/server-model/termDTO';
import {CourseSectionDTO} from '../veriguide-model/server-model/courseSectionDTO';
import {UserService} from '../veriguide-user-service/user-service';
import {VeriguideHttpClient} from '../veriguide-rest-service/veriguide-http-client';
import {AuthenticationStateEnum, LoggedInUser} from '../veriguide-model/server-model/loggedInUser';
import {VeriguideAssignmentDeadlineState} from './veriguide-assignment-deadline-state.enum';
import {UrlPathConfig} from '../veriguide-common-type/url-path-config';
import {URL_PATH_CONFIG, veriguideInjectors} from '../veriguide-common-type/veriguide-injectors';

@Injectable()
export class VeriguideAssignmentDeadlineService {
  // region vars
  // Constants
  public readonly defaultDatepickerTimeFormat = 'YYYY-MM-DD';

  // State management vars
  private _loggedInUser: LoggedInUser = { authenticationState: AuthenticationStateEnum.NeedToLogin };
  private _state: VeriguideAssignmentDeadlineState = VeriguideAssignmentDeadlineState.Init;
  private _schoolID = -1;
  private _currentState: Subject<VeriguideAssignmentDeadlineState> = new BehaviorSubject<VeriguideAssignmentDeadlineState>(null);
  private _urlPathConfig: UrlPathConfig;

  // REST APIs data vars
  private _acadYear: any = null;
  private _acadTerm: any = null;
  private _courseCode: any = null;
  private _assignmentMarkerSchoolLogin: any = null;
  private _assignmentNumber: any = null;
  // endregion

  // region accessors
  constructor(private userService: UserService,
              private veriguideHttpClient: VeriguideHttpClient,
              private pfDate: NgbDateParserFormatter,
              private router: Router) {
    this.initVars();
  }

  private get state(): VeriguideAssignmentDeadlineState {
    return this._state;
  }

  private set state(stateVal: VeriguideAssignmentDeadlineState) {
    console.log('Changing state to: ' + VeriguideAssignmentDeadlineState[stateVal]);
    this._state = stateVal;
    this._currentState.next(stateVal);
  }

  get schoolId(): number {
    return this._schoolID;
  }

  get currentState(): Observable<VeriguideAssignmentDeadlineState> {
    return this._currentState;
  }

  get urlPathConfig(): UrlPathConfig {
    return this._urlPathConfig;
  }

  set courseCode(obj: any) {
    this._courseCode = obj;
  }

  set assignmentNum(obj: any) {
    this._assignmentNumber = obj;
  }
  // endregion

  // region initialization
  private initVars(): void {
    this.userService.getLoggedInUser().subscribe( loggedInUser => {
      this._loggedInUser = loggedInUser;
    });

    this.state = VeriguideAssignmentDeadlineState.Init;
    this._currentState = new BehaviorSubject<VeriguideAssignmentDeadlineState>(null);
    this._urlPathConfig = veriguideInjectors.get(URL_PATH_CONFIG);

    this._acadYear = null;
    this._acadTerm = null;
    this._courseCode = null;
    this._assignmentMarkerSchoolLogin = null;
    this._assignmentNumber = null;
  }

  public reset() {
    this.initVars();
  }
  // endregion

  // region state management
  public alterToCreationForm(): void {
    if (this.isInDeadlinesList() || this.isCreationResultReceived()) {
      this.state = VeriguideAssignmentDeadlineState.DeadlineCreationForm;
    } else {
      this.state = VeriguideAssignmentDeadlineState.Closed;
    }
  }

  public moveNextPhaseInCreation(isSubmitSuccess: boolean = false): void {
    if (this.isInCourseSelectInCreation()) {
      this.state = VeriguideAssignmentDeadlineState.AssignmentDetailInCreation;
    } else if (this.isInAssignmentDetailInCreation()) {
      this.state = VeriguideAssignmentDeadlineState.DeadlineCreationSubmit;
    } else if (this.isInDeadlineCreationSubmit() && isSubmitSuccess) {
      this.state = VeriguideAssignmentDeadlineState.DeadlineCreationSubmitSuccess;
    } else if (this.isInDeadlineCreationSubmit() && !isSubmitSuccess) {
      this.state = VeriguideAssignmentDeadlineState.DeadlineCreationSubmitFailed;
    } else {
      this.state = VeriguideAssignmentDeadlineState.Closed;
    }
  }

  public movePreviousPhaseInCreation(isSubmitSuccess: boolean = false): void {
    if (this.isInCourseSelectInCreation()) {
      this.state = VeriguideAssignmentDeadlineState.AssignmentDeadlinesList;
    } else if (this.isInAssignmentDetailInCreation()) {
      this.state = VeriguideAssignmentDeadlineState.CourseSelectInCreation;
    } else if (this.isInDeadlineCreationSubmit()) {
      this.state = VeriguideAssignmentDeadlineState.AssignmentDetailInCreation;
    } else {
      this.state = VeriguideAssignmentDeadlineState.Closed;
    }
  }

  public getCurrentStateName(): string {
    return VeriguideAssignmentDeadlineState[this.state];
  }

  public isEnabled(): boolean {
    return this.state !== VeriguideAssignmentDeadlineState.Closed;
  }

  public isStarted(): boolean {
    return this.isEnabled() && this.state >= VeriguideAssignmentDeadlineState.Init;
  }

  public isOnCreation(): boolean {
    return this.isEnabled() &&
      (this.state >= VeriguideAssignmentDeadlineState.DeadlineCreationForm &&
       this.state <= VeriguideAssignmentDeadlineState.DeadlineCreationSubmit);
  }

  public isCourseSelectedInCreation(): boolean {
    return this.isOnCreation() && this.state > VeriguideAssignmentDeadlineState.CourseSelectInCreation;
  }

  public isAssignmentDetailFilledInCreation(): boolean {
    return this.isOnCreation() && this.state > VeriguideAssignmentDeadlineState.AssignmentDetailInCreation;
  }

  public isCreationResultReceived(): boolean {
    return this.isInDeadlineCreationSubmitSuccess() && this.isInDeadlineCreationSubmitFailed();
  }

  public isInDeadlinesList(): boolean {
    return this.state === VeriguideAssignmentDeadlineState.Init ||
           this.state === VeriguideAssignmentDeadlineState.AssignmentDeadlinesList;
  }

  public isInCourseSelectInCreation(): boolean {
    return this.state === VeriguideAssignmentDeadlineState.DeadlineCreationForm ||
           this.state === VeriguideAssignmentDeadlineState.CourseSelectInCreation;
  }

  public isInAssignmentDetailInCreation(): boolean {
    return this.state === VeriguideAssignmentDeadlineState.AssignmentDetailInCreation;
  }

  public isInDeadlineCreationSubmit(): boolean {
    return this.state === VeriguideAssignmentDeadlineState.DeadlineCreationSubmit;
  }

  public isInDeadlineCreationSubmitSuccess(): boolean {
    return this.state === VeriguideAssignmentDeadlineState.DeadlineCreationSubmitSuccess;
  }

  public isInDeadlineCreationSubmitFailed(): boolean {
    return this.state === VeriguideAssignmentDeadlineState.DeadlineCreationSubmitFailed;
  }

  public isCUHK(): boolean {
    return this._schoolID === 1;
  }
  // endregion

  // region utils
  public getNgbDateFromString( str: string = null ): NgbDate {
    let ndReturn = null;
    try {
      ndReturn = this.pfDate.parse(str);
    } catch (e) {
      ndReturn = null;
    }
    return ndReturn;
  }

  public getNgbDateString( nd: NgbDateStruct = null ): string {
    let strReturn = '';
    try {
      strReturn = this.pfDate.format(nd);
    } catch (e) {
      strReturn = this.defaultDatepickerTimeFormat;
    }
    return strReturn;
  }
  // endregion

  // region REST API calls
  public getAcadYears(): Observable<AcadYearDTO[]> {
    return this.veriguideHttpClient.get<AcadYearDTO[]>('uploadSubmission/acadYears');
  }

  public getAcadTerms(acadYear: any): Observable<TermDTO[]> {
    this._acadYear = acadYear || this._acadYear;
    return this.veriguideHttpClient.get<TermDTO[]>(`uploadSubmission/${this._acadYear}/terms`);
  }

  public getCourses(acadYear: any, acadTerm: any): Observable<CourseSectionDTO[]> {
    this._acadYear = acadYear || this._acadYear;
    this._acadTerm = acadTerm || this._acadTerm;
    return this.veriguideHttpClient.get<CourseSectionDTO[]>(`uploadSubmission/${this._acadYear}/${this._acadTerm}/courses`);
  }
  // endregion
}
