import { UtilService } from './../../../veriguide-user-service/util.service';
import { BasicRowStyle } from './../row-style/basic-row-style';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/veriguide-user-service/user-service';
import { VeriguideGridService } from './veriguide-grid.service';
import { Subscription } from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-veriguide-grid',
  templateUrl: './veriguide-grid.component.html',
  styleUrls: ['./veriguide-grid.component.css']
})
export class VeriguideGridComponent implements OnInit, OnDestroy {
  @Input() records = new Array();
  @Input() columnDefs = new Array();
  @Input() showSearchBar = true;
  @Input() showAllItemsInOnePage = false;
  @Input() rowStyle = new BasicRowStyle();
  @Input() showNumberOfItemsPerPage: number;
  @Input() getRowHeightFunction: (params: any) => number;
  @Input() showPaginationDropDownButton = true;

  private paginationPageSize: number;

  private gridApi: any;
  private gridColumnApi: any;
  private defaultColDef: any;

  private pageSizeItems = [10, 15, 25, 50, 100];
  private fromRecordNo: number;
  private toRecordNo: number;

  private noRowsTemplate: string;

  private rowSelection = 'single';
  private sizeColumnsToFit = false;

  boundGetRowHeightFunction: (params: any) => number;

  constructor( private route: ActivatedRoute,
               private userService: UserService,
               private translate: TranslateService,
               private veriguideGridService: VeriguideGridService ) {

    this.veriguideGridService.gridInfo.subscribe( gridInfo => {

      if ( gridInfo.columnDefs.length > 0 ) {
        this.columnDefs = gridInfo.columnDefs;
        this.records = gridInfo.records;
        if ( gridInfo.rowStyle !== undefined ) {
          this.rowStyle = gridInfo.rowStyle;
        }
      }

      this.defaultColDef = {
        resizable: true,
        sortable: true,
        unSortIcon: true,
        filter: true,
        headerComponentParams : {
          template:
          '<div class="ag-cell-label-container" role="presentation">' +
          // '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
          '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
          // '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
          // '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
          // '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
          // '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
          '    <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
          // '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
          '  </div>' +
          '</div>'
          }
      };

      this.sizeColumnsToFit = gridInfo.sizeColumnsToFit;

      if ( gridInfo.boundGetRowHeightFunction ) {
        this.getRowHeightFunction = gridInfo.boundGetRowHeightFunction;
      }

      if ( gridInfo.showSearchBar !== undefined ) {
        this.showSearchBar = gridInfo.showSearchBar;
      }

      if ( gridInfo.showPaginationDropDownButton !== undefined ) {
        this.showPaginationDropDownButton = gridInfo.showPaginationDropDownButton;
      }
    });

    this.veriguideGridService.updatedRecords.subscribe( records => {
      this.records = records;
    });

    this.noRowsTemplate = '<span class="ag-cell">No records found</span>';
  }

  ngOnInit() {
    if ( this.getRowHeightFunction ) {
      this.boundGetRowHeightFunction = this.getRowHeightFunction.bind(this);
    } else {
      this.boundGetRowHeightFunction = this.getRowHeight.bind(this);
    }
  }

  onGridReady( params: any ) {
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');

    if ( this.sizeColumnsToFit === true ) {
      this.gridApi.sizeColumnsToFit();
    }

    this.gridColumnApi = params.columnApi;
    if ( this.showAllItemsInOnePage === false ) {
      if ( this.showNumberOfItemsPerPage ) {
        this.onPageSizeSelection( this.showNumberOfItemsPerPage );
      } else {
        this.onPageSizeSelection( this.pageSizeItems[1] );
      }
    }
    this.gotoPage(1);
  }

  onSortChanged( params: any ) {
    this.gridApi.redrawRows();
  }

  onSearchChange(searchValue: string) {
    this.gridApi.setQuickFilter( searchValue );
    this.gridApi.redrawRows();
  }

  gotoPage(pageNumber: number) {
    // 0-based for ag-grid pagination
    this.gridApi.paginationGoToPage( pageNumber - 1) ;
    this.updateFromToRecordNo();
    this.gridApi.redrawRows();
  }

  private onPageSizeSelection( pageSizeItem: number ) {
    this.paginationPageSize  = pageSizeItem;
    this.gridApi.paginationSetPageSize(pageSizeItem);
    this.updateFromToRecordNo();
    this.gridApi.redrawRows();
  }

  private updateFromToRecordNo(): void {

    this.fromRecordNo = this.gridApi.getFirstDisplayedRow() + 1;
    this.toRecordNo = this.gridApi.getLastDisplayedRow() + 1;
  }

  getRowHeight( params: any ): number {
    return 35 ;
  }

  ngOnDestroy(): void {
  }

  onSelectionChanged(event) {
  }


}
