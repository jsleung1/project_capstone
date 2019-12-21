import { UrlPathConfig } from './url-path-config';
import { InjectionToken, Injector } from '@angular/core';
import { VeriguidePathConfig } from './veriguide-path-config';

export let URL_PATH_CONFIG = new InjectionToken<UrlPathConfig>('urlPath.config',
    { providedIn: 'root', factory: () => VeriguidePathConfig }) ;

export const veriguideInjectors = Injector.create({
    providers: [
        { provide: URL_PATH_CONFIG, useValue: VeriguidePathConfig }
    ]
});

