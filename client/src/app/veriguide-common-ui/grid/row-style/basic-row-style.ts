import { RowStyle } from './row-style';

export class BasicRowStyle implements RowStyle {
    getRowStyle(params: any) {
        if (params.node.rowIndex % 2 !== 0) {
            return { background: '#dfefff' };
        } else {
            return { background: '#f4f9ff' };
        }
    }
}
