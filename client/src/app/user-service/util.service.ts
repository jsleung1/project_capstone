import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor() { }

  static isStringEmpty(str: string): boolean {
    if ( ! str ) {
      return true;
    }
    const trimmedStr = str.trim();
    return ! (trimmedStr &&  trimmedStr.length > 0 );
  }
}
