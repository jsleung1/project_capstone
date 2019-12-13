import {Component, Input, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, tap, switchMap, filter} from 'rxjs/operators';
import {NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';

import {StateComponent} from '../../../../veriguide-common-type/state-component';
import {VeriguideSubmissionUploadService} from '../../../veriguide-submission-upload.service';
import { AcadYearDTO, TermDTO, CourseSectionDTO } from '../../../../veriguide-model/models';

@Component({
  selector: 'app-form-course-information',
  templateUrl: './form-course-information.component.html',
  styleUrls: ['./form-course-information.component.css', '../../submission-upload.component.scss']
})
export class FormCourseInformationComponent implements StateComponent, OnInit, OnDestroy, AfterViewInit {
  @Input() fg: FormGroup;
  readonly timeInputDebounce = 300;
  readonly minInputLengthSearch = 2;
  readonly maxDisplaySearchedRows = 10;
  readonly messagesSearch: {[key: string]: string} = {
    none: '',
    searching: 'assignmentUpload.course.searching',
    searchingNotFound: 'assignmentUpload.course.searching.notfound'
  };

  private selectedAcadYear: AcadYearDTO;
  private selectedTerm: TermDTO;
  private selectedCourse: CourseSectionDTO;

  private strInputCourseSelect = '';
  private isCourseSearching = false;
  private isCourseSearchFailed = false;

  // Those values should be obtained from the server
  private acadYearDTOs: AcadYearDTO[] = null;
  private termDTOs: TermDTO[] = null;
  private courseDTOs: CourseSectionDTO[] = null;

  constructor( private sUploadService: VeriguideSubmissionUploadService) {
  }

  ngOnInit() {
    this.fg.addControl('courseChoice', new FormControl('', Validators.required));

    this.sUploadService.currentState.subscribe((state) => {
      if (this.sUploadService.isInCourseSelection()) {
        this.enterState();
      } else {
        this.leaveState();
      }
    });
  }

  ngOnDestroy() {
    this.fg.removeControl('courseChoice');
  }

  ngAfterViewInit(): void {
  }

  enterState(): void {
    this.initVars();
  }

  leaveState(): void {
  }

  initVars(): void {
    this.acadYearDTOs = null;
    this.termDTOs = null;
    this.courseDTOs = null;
    this.updateAcadYears();

    this.selectedAcadYear = null;
    this.selectedTerm = null;
    this.selectedCourse = null;

    this.strInputCourseSelect = '';
    this.isCourseSearching = false;
    this.isCourseSearchFailed = false;

    if (this.fg.get('courseChoice')) { this.fg.get('courseChoice').setValue(null); }
    // auto-select the current year-term for users?
  }

  resetVars(): void {
  }

  fmtCourse = (result: CourseSectionDTO): string => { if (result) { return result.yearTermCourseCodeSection.toUpperCase().trim(); } };

  searchCourse = (text$: Observable<string>): Observable<CourseSectionDTO[]> => {
    return text$.pipe(
      debounceTime(this.timeInputDebounce),
      distinctUntilChanged(),
      filter((courseInput: string) => courseInput.trim().length >= this.minInputLengthSearch),
      tap(() => this.isCourseSearching = true),
      switchMap((courseInput: string) =>
        this.sUploadService.getCoursesFromInputWithLimit(this.maxDisplaySearchedRows, courseInput).pipe(
          tap(() => this.isCourseSearchFailed = false),
          catchError(() => {
            this.isCourseSearchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => this.isCourseSearching = false)
    );
  }

  private getCourseSearchMessage(): string {
    let strMessage = '';
    if (!this.messagesSearch) {
      strMessage = '';
    } else if (this.isCourseSearching) {
      strMessage = this.messagesSearch.searching;
    } else if (this.isCourseSearchFailed) {
      strMessage = this.messagesSearch.searchingNotFound;
    } else {
      strMessage = this.messagesSearch.none;
    }
    return strMessage;
  }

  private onAcadYearSelectionChange( event?: Event ) {
    this.updateAcadTerms();
    this.updateCourses();
  }

  private onTermSelectionChange( event?: Event ) {
    this.updateCourses();
  }

  private onCourseSelectedFromList( value?: CourseSectionDTO ) {
    const selectedCourse: CourseSectionDTO = value;
    this.confirmCourseSelected(selectedCourse);
  }

  private onCourseSelectedFromType( item: NgbTypeaheadSelectItemEvent ) {
    const selectedCourse: CourseSectionDTO = item.item;
    this.confirmCourseSelected(selectedCourse);
  }

  private onClickSelectCourseAgain(event ?: Event) {
    this.sUploadService.movePreviousPhase();
  }

  private confirmCourseSelected(selectedCourse: CourseSectionDTO) {
    this.selectedCourse = selectedCourse || this.selectedCourse;
    if ( this.selectedAcadYear && this.selectedTerm && this.selectedCourse ) {
      this.setCourseChoice();
      this.sUploadService.moveNextPhase();
    }
  }

  private setCourseChoice() {
    this.fg.get('courseChoice').setValue(this.selectedCourse);
    this.sUploadService.courseCode = this.selectedCourse.yearTermCourseCodeSection;
  }

  private updateAcadYears() {
    this.sUploadService.getAcadYears()
      .subscribe(acadYearDTOs => {this.acadYearDTOs = acadYearDTOs; });
    if (this.acadYearDTOs && this.acadYearDTOs.length) {
      this.selectedAcadYear = this.acadYearDTOs[0];
    }
  }

  private updateAcadTerms() {
    if ( !this.selectedAcadYear ) { return; }
    this.sUploadService.getAcadTerms(this.selectedAcadYear.acadYear)
      .subscribe( termDTOs => {this.termDTOs = termDTOs; });
    if (this.termDTOs && this.termDTOs.length) {
      this.selectedTerm = this.termDTOs[0];
    }
  }

  private updateCourses() {
    if ( !this.selectedAcadYear || !this.selectedTerm ) { return; }
    this.sUploadService.getCourses(this.selectedAcadYear.acadYear, this.selectedTerm.term)
      .subscribe(courseDTOs => { this.courseDTOs = courseDTOs; });
    if (this.courseDTOs && this.courseDTOs.length) {
      this.selectedCourse = this.courseDTOs[0];
    }
  }
}
