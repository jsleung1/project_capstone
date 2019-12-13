import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { AlertDialogService } from '../veriguide-common-ui/dialog/alert-dialog/alert-dialog-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { apiEndpoint } from '../config';

@Injectable()
export class VeriguideHttpInterceptor implements HttpInterceptor {

  constructor( private alertDialogService: AlertDialogService,
               private spinner: NgxSpinnerService ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const baseUrl = document.getElementsByTagName('base')[0].href;

    let newUrl: HttpRequest<any>;
    if ( req.url && req.url.length > 0 && req.url.includes('assets')) {
      newUrl = req;
    } else {
      
      newUrl = req.clone({ url: `${apiEndpoint}/${req.url}` });
    }

    return next.handle(newUrl).pipe(
      catchError(e => {
        
        console.log(e);

        this.spinner.hide();
        this.alertDialogService.openDialog({
          title: `VeriGuide Returns Error Code ${e.status}`,
          message: e.error,
          dialogType: 'OKDialog'
        }).then( res => {
        });
        return throwError(e);
      })
    );
  }
}
