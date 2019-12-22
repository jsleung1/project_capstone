import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { AlertDialogService } from '../common-ui/dialog/alert-dialog/alert-dialog-service';

@Injectable()
export class VerimarkerHttpInterceptor implements HttpInterceptor {

  constructor( private alertDialogService: AlertDialogService ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(e => {
        this.alertDialogService.openDialog({
          title: `VeriMarker Returns Error Code ${e.status}`,
          message: e.error,
          dialogType: 'OKDialog'
        }).then( res => {
        });
        return throwError(e);
      })
    );
  }
}
