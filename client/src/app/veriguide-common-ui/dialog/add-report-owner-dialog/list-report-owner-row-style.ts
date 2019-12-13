import { RowStyle } from '../../grid/row-style/row-style';
import { ReportSharedUserDTO } from '../../../veriguide-model/models';

export class ListReportOwnerRowStyle implements RowStyle {

    getRowStyle(params: any) {

        const reportSharedUserDTO: ReportSharedUserDTO = params.data;
        const styleObject = {
            color: '',
            background: ''
        };

        if ( reportSharedUserDTO.share_mode === 'ROLE' ) {
            styleObject.color = '#0000ff';
        }

        if (params.node.rowIndex % 2 !== 0) {
            styleObject.background =  '#dfefff';
        } else {
            styleObject.background =  '#f4f9ff';
        }
        return styleObject;
    }
}
