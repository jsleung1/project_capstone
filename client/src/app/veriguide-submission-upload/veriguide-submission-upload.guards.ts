import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';

import { VeriguideSubmissionUploadService } from './veriguide-submission-upload.service';

@Injectable()
export class VeriguideSubmissionUploadGuard implements CanActivate {

  constructor(private router: Router,
              private sUploadService: VeriguideSubmissionUploadService) {
  }

  canActivate(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let blnReturn = false;
    switch (snapshot.url.toString().trim()) {
      case 'uploadSuccess': {blnReturn = this.sUploadService.isInSubmitSuccessed(); break; }
      case 'uploadFailed': {blnReturn = this.sUploadService.isInSubmitFailed(); break; }
      default: {blnReturn = true; break; }
    }
    if (!blnReturn) {this.router.navigate( [ snapshot.data.uploadCondRedirectUrl ] ); }
    return blnReturn;
  }
}

export const VeriguideSubmissionUploadGuards: Array<any> = [
  VeriguideSubmissionUploadGuard
];
