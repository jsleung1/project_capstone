import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dynamic-component-directive]'
})
export class DynamicComponentDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
