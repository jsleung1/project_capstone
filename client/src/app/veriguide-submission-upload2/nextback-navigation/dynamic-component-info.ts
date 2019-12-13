import { Type } from '@angular/core';

export interface DynamicComponentInfo {
  orderIndexes: Array<number>;
  component: Type<any>;
  inputData: any;
}

