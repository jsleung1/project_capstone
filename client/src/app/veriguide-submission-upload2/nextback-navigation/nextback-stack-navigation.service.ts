import { Injectable } from '@angular/core';
import { DynamicComponentInfo } from './dynamic-component-info';
import { DynamicContainerComponent } from '../dynamic-component-container/dynamic-container.component';
import { DynamicComponent } from '../dynamic-component';

@Injectable({
  providedIn: 'root'
})
export class NextBackStackNavigationService {

  private currentNavigationIndex = -1;
  private currentUserStepIdx = 0;

  private dynamicComponentInfos: Array<DynamicComponentInfo> = [];
  private dynamicComponentContainer: DynamicContainerComponent;

  private dynamicComponents: Array<DynamicComponent> = [];

  constructor() {
  }

  private loadDynamicComponent( dynamicComponentInfo: DynamicComponentInfo)  {
    const componentFactoryResolver = this.dynamicComponentContainer.getComponentFactoryResolver();
    const viewContainerRef = this.dynamicComponentContainer.getComponentContainer().viewContainerRef;
    const componentFactory = componentFactoryResolver.resolveComponentFactory(dynamicComponentInfo.component);

    const currentDynamicComponent = viewContainerRef.createComponent(componentFactory).instance as DynamicComponent;
    currentDynamicComponent.OnNotify( 'onNextCreate', dynamicComponentInfo );

    this.dynamicComponents.push( currentDynamicComponent );
  }

  private closeDynamicComponent( currentNavigationIndex: number ) {
    const viewContainerRef = this.dynamicComponentContainer.getComponentContainer().viewContainerRef;
    viewContainerRef.get( currentNavigationIndex ).destroy();

    this.dynamicComponents.pop();

    const currentComponentInfo = this.dynamicComponentInfos[ currentNavigationIndex ];
    this.dynamicComponents.slice(-1)[0].OnNotify('onBackActivate', currentComponentInfo );
  }

  public first() {
    if ( this.dynamicComponentInfos.length > 0 ) {

      this.currentNavigationIndex = 0;
      this.currentUserStepIdx = 0;
      this.loadDynamicComponent( this.dynamicComponentInfos[ this.currentNavigationIndex ] );
      return;
    }
  }

  public back() {
    if ( this.currentUserStepIdx > 0 ) {
      const currentComponentInfo = this.dynamicComponentInfos[ this.currentNavigationIndex ];

      const found = currentComponentInfo.orderIndexes.find(s => {
        return  s === this.currentUserStepIdx - 1;
      });

      if ( found  !== undefined ) {
        // get last component in array and notify again
        this.dynamicComponents.slice(-1)[0].OnNotify('onBackReActivate', currentComponentInfo );
        this.currentUserStepIdx--;
      } else {
        this.dynamicComponents.slice(-1)[0].OnNotify('onBackDestroy', currentComponentInfo );
        this.closeDynamicComponent( this.currentNavigationIndex-- );
        this.currentUserStepIdx--;
      }
    }
  }

  public next() {
    if ( this.currentNavigationIndex  < this.dynamicComponentInfos.length - 1 ) {

      const currentComponentInfo = this.dynamicComponentInfos[ this.currentNavigationIndex ];
      const componentInfoToUse = this.dynamicComponentInfos[ this.currentNavigationIndex + 1 ];

      const found = currentComponentInfo.orderIndexes.find(s => {
        return  s === this.currentUserStepIdx + 1;
      });

      if ( found  !== undefined ) {
        // console.log('onNext');

        // get last component in array and notify again
        this.dynamicComponents.slice(-1)[0].OnNotify('onNextReActivate', currentComponentInfo );
        this.currentUserStepIdx++;

      } else {
        // console.log('create');

        this.dynamicComponents.slice(-1)[0].OnNotify('onNextDeactivate', currentComponentInfo );
        this.loadDynamicComponent( componentInfoToUse );

        this.currentNavigationIndex++;
        this.currentUserStepIdx++;
      }
    }
  }

  public setDynamicComponentInfos(dynamicComponentInfos: Array<DynamicComponentInfo>) {
    this.dynamicComponentInfos = dynamicComponentInfos;
  }

  public setDynamicContainerComponent( factory: DynamicContainerComponent) {
    this.dynamicComponentContainer = factory;
  }

  public isInFirstComponent() {
    return this.currentUserStepIdx === 0;
  }

  public isInLastComponent() {
    return this.currentNavigationIndex === this.dynamicComponentInfos.length - 1;
  }
}
