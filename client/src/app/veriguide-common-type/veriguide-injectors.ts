import { UserLoginConfig } from './user-login-config';
import { CUHKLoginConfig } from './cuhklogin-config';
import { UrlPathConfig } from './url-path-config';
import { InjectionToken, Injector } from '@angular/core';
import { VeriguidePathConfig } from './veriguide-path-config';

export let URL_PATH_CONFIG = new InjectionToken<UrlPathConfig>('urlPath.config',
    { providedIn: 'root', factory: () => VeriguidePathConfig }) ;

export let CUHK_LOGIN_CONFIG = new InjectionToken<UserLoginConfig>('cuhklogin.config',
    { providedIn: 'root', factory: () => CUHKLoginConfig }) ;

export const veriguideInjectors = Injector.create({
    providers: [
        { provide: URL_PATH_CONFIG, useValue: VeriguidePathConfig },
        { provide: CUHK_LOGIN_CONFIG, useValue: CUHKLoginConfig }
    ]
});

