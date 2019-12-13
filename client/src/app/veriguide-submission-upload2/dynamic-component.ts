import { DynamicComponentInfo } from './nextback-navigation/dynamic-component-info';

export interface DynamicComponent {

    dynamicComponentInfo: DynamicComponentInfo;
    OnNotify(eventName: string, dynamicComponentInfo: DynamicComponentInfo );

}
