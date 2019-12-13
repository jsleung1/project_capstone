import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { AlertDialogItems } from './alert-dialog-items';
import { AlertDialogComponent } from './alert-dialog.component';


@Injectable({
    providedIn: 'root'
})
export class AlertDialogService {
    constructor(private modalService: NgbModal ) {
    }
    public openDialog(displayItems: AlertDialogItems ): Promise<any> {
        const modalRef = this.modalService.open( AlertDialogComponent, {
            centered: true,
            backdrop : 'static',
            keyboard : false
        } );
        modalRef.componentInstance.dialogType = displayItems.dialogType;
        modalRef.componentInstance.title = displayItems.title;
        modalRef.componentInstance.message = displayItems.message;
        return modalRef.result;

    }
}


