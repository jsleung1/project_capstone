import { UserSubmissionsDTO } from './../../../veriguide-model/server-model/userSubmissionsDTO';
import { RowStyle } from './row-style';

export class ViewSubmissionsRowStyle implements RowStyle {
    getRowStyle(params: any) {

        const userSubmissionsDTO: UserSubmissionsDTO = params.data;

        if ( userSubmissionsDTO.reportStatus === 'ERR') {
            if (params.node.rowIndex % 2 !== 0) {
                return { background: '#E799A3' };
            } else {
                return { background: '#FAAFBA' };
            }
        } else if ( userSubmissionsDTO.reportStatus === 'WRN') {
            if (params.node.rowIndex % 2 !== 0) {
                return { background: '#fad42e' };
            } else {
                return { background: '#fbec88' };
            }
        } else if ( userSubmissionsDTO.reportStatus === 'NSUB') {
            if (params.node.rowIndex % 2 !== 0) {
                return {
                    background: '#dfefff',
                    color: '#808080'
                };
            } else {
                return {
                    background: '#f4f9ff',
                    color: '#808080'
                };
            }
        } else {
            if (params.node.rowIndex % 2 !== 0) {
                return { background: '#dfefff' };
            } else {
                return { background: '#f4f9ff' };
            }
        }
    }
}
