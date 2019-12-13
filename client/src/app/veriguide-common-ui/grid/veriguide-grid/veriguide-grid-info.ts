import { RowStyle } from '../row-style/row-style';

export interface VeriguideGridInfo {
    columnDefs: Array<any>;
    records: Array<any>;
    rowStyle?: RowStyle;
    sizeColumnsToFit?: boolean;
    showSearchBar?: boolean;
    showPaginationDropDownButton?: boolean;
    boundGetRowHeightFunction?: (params: any) => number;
}
