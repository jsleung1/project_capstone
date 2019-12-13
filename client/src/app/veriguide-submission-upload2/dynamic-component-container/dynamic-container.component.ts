import { Component, OnInit, OnDestroy, ComponentFactoryResolver, Input, ViewChild } from '@angular/core';
import { DynamicComponentDirective } from './dynamic-component.directive';
import { DynamicComponentInfo } from '../nextback-navigation/dynamic-component-info';

@Component({
  selector: 'app-dynamic-component-container',
  templateUrl: './dynamic-container.component.html'
})
export class DynamicContainerComponent implements OnInit, OnDestroy {

  @ViewChild(DynamicComponentDirective, {static: true}) dynamicComponents: DynamicComponentDirective;
  constructor( private componentFactoryResolver: ComponentFactoryResolver ) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

    /*
  loadDynamicComponent( dynamicComponentInfo: DynamicComponentInfo ) {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(dynamicComponentInfo.component);

    // for ( let i = 0; i < 2; ++i ) {
      // disable the following call for stackable item
      // viewContainerRef.clear();

    const componentRef = this.dynamicComponentsContainer.viewContainerRef.createComponent(componentFactory);
    const newDynamicComponent = componentRef.instance as DynamicComponent;
    newDynamicComponent.inputData = dynamicComponentInfo.inputData;
    // }

    this.dynamicComponentsContainer.viewContainerRef.get(0).destroy();

  }
  */

  getComponentFactoryResolver(): ComponentFactoryResolver {
    return this.componentFactoryResolver;
  }

  getComponentContainer(): DynamicComponentDirective {
    return this.dynamicComponents;
  }
}
