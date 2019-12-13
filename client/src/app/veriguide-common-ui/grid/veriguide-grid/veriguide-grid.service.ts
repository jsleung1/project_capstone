import { VeriguideGridInfo } from './veriguide-grid-info';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VeriguideGridService {

  gridInfo: BehaviorSubject<VeriguideGridInfo>;
  updatedRecords =  new Subject<Array<any>>();

  constructor() {
    this.gridInfo = new BehaviorSubject<VeriguideGridInfo>({
      columnDefs: [],
      records: [],
      rowStyle: null,
      sizeColumnsToFit: false,
      showSearchBar: true,
      showPaginationDropDownButton: true
    });
  }

}
