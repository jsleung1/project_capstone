import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {AcadYearDTO, CourseSectionDTO, TermDTO} from '../../../../veriguide-model/models';
import {VeriguideAssignmentDeadlineService} from '../../../veriguide-assignment-deadline.service';
import {StateComponent} from '../../../../veriguide-common-type/state-component';
import {NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form-course-selection',
  templateUrl: './form-course-selection.component.html',
  styleUrls: ['./form-course-selection.component.scss', '../../assignment-deadline.component.scss']
})
export class FormCourseSelectionComponent implements StateComponent, OnInit, OnDestroy, AfterViewInit {
  @Input() fg: FormGroup;

  private selectedAcadYear: AcadYearDTO;
  private selectedTerm: TermDTO;
  private selectedCourse: CourseSectionDTO;

  private strInputCourseSelect = '';
  private isCourseSearching = false;
  private isCourseSearchFailed = false;

  private acadYearDTOs: AcadYearDTO[] = null;
  private termDTOs: TermDTO[] = null;
  private courseDTOs: CourseSectionDTO[] = null;

  constructor(private sAsgnDeadline: VeriguideAssignmentDeadlineService) {
  }

  ngOnInit() {
    this.fg.addControl('courseChoice', new FormControl('', Validators.required));

    this.sAsgnDeadline.currentState.subscribe((state) => {
      if (this.sAsgnDeadline.isInCourseSelectInCreation()) {
        this.enterState();
      } else {
        this.leaveState();
      }
    });
  }

  ngOnDestroy() {
    this.fg.removeControl('courseChoice');
  }

  ngAfterViewInit() {
  }

  enterState() {
    this.initVars();
  }

  leaveState() {
  }

  resetVars() {
  }

  initVars() {
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
  }

  private confirmCourseSelected(selectedCourse: CourseSectionDTO) {
    this.selectedCourse = selectedCourse || this.selectedCourse;
    if ( this.selectedAcadYear && this.selectedTerm && this.selectedCourse ) {
      console.log('this.selectedAcadYear: ' + JSON.stringify(this.selectedAcadYear));
      console.log('this.selectedTerm: ' + JSON.stringify(this.selectedTerm));
      console.log('this.selectedCourse: ' + JSON.stringify(this.selectedCourse));
      this.setCourseChoice();
      this.sAsgnDeadline.moveNextPhaseInCreation();
    }
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
    this.sAsgnDeadline.movePreviousPhaseInCreation();
  }

  private setCourseChoice() {
    this.fg.get('courseChoice').setValue(this.selectedCourse);
    this.sAsgnDeadline.courseCode = this.selectedCourse.yearTermCourseCodeSection;
    console.log('The current courseChoice: ' + JSON.stringify(this.fg.get('courseChoice').value));
  }

  private updateAcadYears() {
    this.sAsgnDeadline.getAcadYears()
      .subscribe(acadYearDTOs => {this.acadYearDTOs = acadYearDTOs; });
    if (this.acadYearDTOs && this.acadYearDTOs.length) {
      this.selectedAcadYear = this.acadYearDTOs[0];
    }
  }

  private updateAcadTerms() {
    if ( !this.selectedAcadYear ) { return; }
    this.sAsgnDeadline.getAcadTerms(this.selectedAcadYear.acadYear)
      .subscribe( termDTOs => {this.termDTOs = termDTOs; });
    if (this.termDTOs && this.termDTOs.length) {
      this.selectedTerm = this.termDTOs[0];
    }
  }

  private updateCourses() {
    if ( !this.selectedAcadYear || !this.selectedTerm ) { return; }
    this.sAsgnDeadline.getCourses(this.selectedAcadYear.acadYear, this.selectedTerm.term)
      .subscribe(courseDTOs => { this.courseDTOs = courseDTOs; });
    if (this.courseDTOs && this.courseDTOs.length) {
      this.selectedCourse = this.courseDTOs[0];
    }
  }
}
