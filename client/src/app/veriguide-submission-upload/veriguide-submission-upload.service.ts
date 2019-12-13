import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup} from '@angular/forms';

import {Subject, BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {NgbDate, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import {URL_PATH_CONFIG, veriguideInjectors} from '../veriguide-common-type/veriguide-injectors';
import {AuthenticationStateEnum, LoggedInUser} from '../veriguide-model/server-model/loggedInUser';
import {UserService} from '../veriguide-user-service/user-service';
import {VeriguideHttpClient} from '../veriguide-rest-service/veriguide-http-client';
import {VeriguideSubmissionUploadState} from './veriguide-submission-upload-state.enum';
import {AcadYearDTO, TermDTO, CourseSectionDTO, AssignmentMarkerDTO, AssignmentDeadLineDTO, UploadSubmissionResultDTO} from '../veriguide-model/models';
import {UrlPathConfig} from '../veriguide-common-type/url-path-config';
import * as fieldsAssignmentInfo from '../veriguide-submission-upload/submission-upload/submission-upload-form/form-assignment-information/form-assignment-information.fields';

// Providing a singleton service provider to the Submission Upload feature
@Injectable()
export class VeriguideSubmissionUploadService {
  // region vars
  // Constants
  public readonly defaultDatepickerTimeFormat = 'YYYY-MM-DD';

  // State management vars
  private _loggedInUser: LoggedInUser = { authenticationState: AuthenticationStateEnum.NeedToLogin };
  private _state: VeriguideSubmissionUploadState = VeriguideSubmissionUploadState.Init;
  private _schoolID = -1;
  private _currentState: Subject<VeriguideSubmissionUploadState> = new BehaviorSubject<VeriguideSubmissionUploadState>(null);
  private _urlPathConfig: UrlPathConfig;
  private _objSubmitted: any = null;
  private _objReceived: UploadSubmissionResultDTO = null;

  // REST APIs data vars
  private _acadYear: any = null;
  private _acadTerm: any = null;
  private _courseInput: string = null;
  private _courseCode: any = null;
  private _assignmentMarkerSchoolLogin: any = null;
  private _assignmentNumber: any = null;
  private _formData: FormData = null;
  // endregion

  // region accessors
  constructor( private userService: UserService,
               private veriguideHttpClient: VeriguideHttpClient,
               private pfDate: NgbDateParserFormatter,
               private router: Router) {
    this.initVars();
  }

  private get state(): VeriguideSubmissionUploadState {
    return this._state;
  }

  private set state(stateVal: VeriguideSubmissionUploadState) {
    this._state = stateVal;
    this._currentState.next(stateVal);
  }

  get schoolId(): number {
    return this._schoolID;
  }

  get currentState(): Observable<VeriguideSubmissionUploadState> {
    return this._currentState;
  }

  get urlPathConfig(): UrlPathConfig {
    return this._urlPathConfig;
  }

  get objSubmitted(): any {
    return this._objSubmitted;
  }

  get objReceived(): UploadSubmissionResultDTO {
    return this._objReceived;
  }

  set courseCode(obj: any) {
    this._courseCode = obj;
  }

  set assignmentNum(obj: any) {
    this._assignmentNumber = obj;
  }

  get formData(): FormData {
    return this._formData;
  }
  // endregion

  // region initialization
  private initVars(): void {
    this.userService.getLoggedInUser().subscribe( loggedInUser => {
      this._loggedInUser = loggedInUser;
    });

    this.state = VeriguideSubmissionUploadState.Init;
    this._currentState = new BehaviorSubject<VeriguideSubmissionUploadState>(null);
    this._urlPathConfig = veriguideInjectors.get(URL_PATH_CONFIG);
    this._objSubmitted = null;
    this._objReceived = null;

    this._acadYear = null;
    this._acadTerm = null;
    this._courseInput = null;
    this._courseCode = null;
    this._assignmentMarkerSchoolLogin = null;
    this._assignmentNumber = null;
    this._formData = null;
  }

  public reset() {
    this.initVars();
  }
  // endregion

  // region state management
  public moveNextPhase(isSubmitSuccess: boolean = false): void {
    if (this.state >= VeriguideSubmissionUploadState.Init && this.state <= VeriguideSubmissionUploadState.CourseSelect) {
      this.state = VeriguideSubmissionUploadState.AssignmentSelect;
    } else if (this.state === VeriguideSubmissionUploadState.AssignmentSelect) {
      this.state = VeriguideSubmissionUploadState.Confirmation;
    } else if (this.state === VeriguideSubmissionUploadState.Confirmation) {
      this.state = VeriguideSubmissionUploadState.Agreement;
    } else if (this.state === VeriguideSubmissionUploadState.Agreement) {
      this.state = VeriguideSubmissionUploadState.AssignmentSubmit;
    } else if (this.state === VeriguideSubmissionUploadState.AssignmentSubmit && isSubmitSuccess) {
      this.state = VeriguideSubmissionUploadState.AssignmentSubmitSuccess;
    } else if (this.state === VeriguideSubmissionUploadState.AssignmentSubmit && !isSubmitSuccess) {
      this.state = VeriguideSubmissionUploadState.AssignmentSubmitFailed;
    } else {
      this.state = VeriguideSubmissionUploadState.Closed;
    }
  }

  public movePreviousPhase(isSubmitSuccess: boolean = false): void {
    if (this.state >= VeriguideSubmissionUploadState.Init && this.state <= VeriguideSubmissionUploadState.CourseSelect) {
      this.state = VeriguideSubmissionUploadState.Init;
    } else if (this.state === VeriguideSubmissionUploadState.AssignmentSelect) {
      this.state = VeriguideSubmissionUploadState.CourseSelect;
    } else if (this.state === VeriguideSubmissionUploadState.Confirmation) {
      this.state = VeriguideSubmissionUploadState.AssignmentSelect;
    } else if (this.state === VeriguideSubmissionUploadState.Agreement) {
      this.state = VeriguideSubmissionUploadState.Confirmation;
    } else if (this.state >= VeriguideSubmissionUploadState.AssignmentSubmit && this.state <= VeriguideSubmissionUploadState.AssignmentSubmitSuccess) {
      this.state = VeriguideSubmissionUploadState.Agreement;
    } else {
      this.state = VeriguideSubmissionUploadState.Init;
    }
  }

  public getCurrentStateName(): string {
    return VeriguideSubmissionUploadState[this.state];
  }

  public isEnabled(): boolean {
    return this.state !== VeriguideSubmissionUploadState.Closed;
  }

  public isStarted(): boolean {
    return this.isEnabled() && this.state >= VeriguideSubmissionUploadState.Init;
  }

  public isCourseSelected(): boolean {
    return this.isEnabled() && this.state > VeriguideSubmissionUploadState.CourseSelect;
  }

  public isAssignmentSelected(): boolean {
    return this.isEnabled() && this.state > VeriguideSubmissionUploadState.AssignmentSelect;
  }

  public isConfirmationAccepted(): boolean {
    return this.isEnabled() && this.state > VeriguideSubmissionUploadState.Confirmation;
  }

  public isAgreementAccepted(): boolean {
    return this.isEnabled() && this.state > VeriguideSubmissionUploadState.Agreement;
  }

  public isStandbyToSubmit(): boolean {
    return this.isEnabled() && this.state >= VeriguideSubmissionUploadState.AssignmentSubmit;
  }

  public isInCourseSelection(): boolean {
    return this.state >= VeriguideSubmissionUploadState.Init && this.state <= VeriguideSubmissionUploadState.CourseSelect;
  }

  public isInAssignmentSelection(): boolean {
    return this.state === VeriguideSubmissionUploadState.AssignmentSelect;
  }

  public isInConfirmation(): boolean {
    return this.state === VeriguideSubmissionUploadState.Confirmation;
  }

  public isInAgreement(): boolean {
    return this.state === VeriguideSubmissionUploadState.Agreement;
  }

  public isInSubmission(): boolean {
    return this.state === VeriguideSubmissionUploadState.AssignmentSubmit;
  }

  public isInSubmitSuccessed(): boolean {
    return this.state === VeriguideSubmissionUploadState.AssignmentSubmitSuccess && this.objSubmitted != null && this.objReceived != null;
  }

  public isInSubmitFailed(): boolean {
    return this.state === VeriguideSubmissionUploadState.AssignmentSubmitFailed && this.objSubmitted != null && this.objReceived != null;
  }

  public isCUHK(): boolean {
    return this._schoolID === 1;
  }
  // endregion

  // region utils
  public ascOrder = (a, b): number => {
    const strA = String(a.key);
    const strB = String(a.key);
    const numA = Number(strA);
    const numB = Number(strB);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA > numB ? -1 : (numB > numA ? 1 : 0);
    } else {
      return strA > strB ? -1 : (strB > strA ? 1 : 0);
    }
  }

  public descOrder = (a, b): number => {
    const strA = String(a.key);
    const strB = String(a.key);
    const numA = Number(strA);
    const numB = Number(strB);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA > numB ? 1 : (numB > numA ? -1 : 0);
    } else {
      return strA > strB ? 1 : (strB > strA ? -1 : 0);
    }
  }

  public getBasename(path: string) {
    return path.split(/[\\/]/).pop();
  }

  public getSizedString(inputString: string, maxLength: number) {
    return inputString.length > maxLength ? (inputString.slice(0, maxLength) + '...') : inputString;
  }

  public getSizedBasename(path: string, maxLength: number) {
    return this.getSizedString(this.getBasename(path), maxLength);
  }

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

  // region form submission
  public setFormData(fg: FormGroup) {
    const formData: FormData = new FormData();
    formData.append('assignmentFile', fg.get(fieldsAssignmentInfo.namesFieldItems.aFileD).value);
    formData.append('assignmentDeadLine', this.getNgbDateString(fg.get(fieldsAssignmentInfo.namesFieldItems.aDl).value));
    formData.append('assignmentType', String(fg.get(fieldsAssignmentInfo.namesFieldItems.sType).value));
    formData.append('assignmentMarker', String(fg.get(fieldsAssignmentInfo.namesFieldItems.aMarker).value.primaryLoginId));
    this._formData = formData;
  }

  public navigateToResultPage(isPostSuccess: boolean, objSubmitted: any, objReceived: any) {
    if (!this.isInSubmission()) { throw new RangeError('In the invalid state to submit assignment: ' + this.getCurrentStateName()); }
    this._objSubmitted = objSubmitted || this._objSubmitted;
    this._objReceived = objReceived || this._objReceived;
    const urlNav: string = isPostSuccess ? this._urlPathConfig.userAssignmentSubmissionUploadSuccess.fullPath : this._urlPathConfig.userAssignmentSubmissionUploadFailed.fullPath;
    this.moveNextPhase(isPostSuccess);
    this.router.navigate( [ urlNav ] );
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

  public getCoursesFromInput(courseInput: string, acadYear?: any, acadTerm?: any): Observable<CourseSectionDTO[]> {
    this._courseInput = courseInput || this._courseInput;
    this._acadYear = acadYear || this._acadYear;
    this._acadTerm = acadTerm || this._acadTerm;

    return this.veriguideHttpClient.get<CourseSectionDTO[]>(`uploadSubmission/${this._acadYear}/${this._acadTerm}/search/${this._courseInput}`);
  }

  public getCoursesFromInputWithLimit(limit: number, courseInput: string, acadYear?: any, acadTerm?: any): Observable<CourseSectionDTO[]> {
    if (limit <= 0) { return null; }

    return this.getCoursesFromInput(courseInput, acadYear, acadTerm)
      .pipe(map((aryResults: CourseSectionDTO[]) => aryResults ? aryResults.slice(0, limit) : []));
  }

  public getAssignmentMarkers(courseCode?: any): Observable<AssignmentMarkerDTO[]> {
    this._courseCode = courseCode || this._courseCode;
    return this.veriguideHttpClient.get<AssignmentMarkerDTO[]>(`uploadSubmission/${this._courseCode}/assignmentMarkers`);
  }

  public getAssignmentNumbers( assignmentMarkerSchoolLogin: string, courseCode?: any ): Observable<AssignmentMarkerDTO[]> {
    this._assignmentMarkerSchoolLogin = assignmentMarkerSchoolLogin || this._assignmentMarkerSchoolLogin;
    this._courseCode = courseCode || this._courseCode;
    return this.veriguideHttpClient.get<AssignmentMarkerDTO[]>(`uploadSubmission/${this._courseCode}/${this._assignmentMarkerSchoolLogin}/assignmentNumbers`);
  }

  public getAssignmentDeadLine( assignmentMarkerSchoolLogin: string, assignmentNumber: number, courseCode?: any ): Observable<AssignmentDeadLineDTO[]> {
    this._assignmentMarkerSchoolLogin = assignmentMarkerSchoolLogin || this._assignmentMarkerSchoolLogin;
    this._assignmentNumber = assignmentNumber || this._assignmentNumber;
    this._courseCode = courseCode || this._courseCode;
    return this.veriguideHttpClient.get<AssignmentDeadLineDTO[]>(`uploadSubmission/${this._courseCode}/${this._assignmentMarkerSchoolLogin}/${this._assignmentNumber}/assignmentDeadLines`);
  }

  public postUploadSubmission(courseCode?: any, assignmentNumber?: any, formData?: FormData): Observable<UploadSubmissionResultDTO> {
    this._courseCode = courseCode || this._courseCode;
    this._assignmentNumber = assignmentNumber || this._assignmentNumber;
    this._formData = formData || this._formData;
    return this.veriguideHttpClient.postFile<FormData>(`uploadSubmission/${this._courseCode}/${this._assignmentNumber}/submit`, this.formData );
  }
  // endregion
}
