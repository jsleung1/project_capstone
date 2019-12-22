
import { TopMenuItem } from './top-menu-item';
import { ContentMenuItem } from './content-menu-item';
import { LoggedInUser } from '../model/loggedInUser';

export class UserMenuContainer {
    topMenuItems: TopMenuItem[] = new Array();
    contentMenuItems: ContentMenuItem[] = new Array();
    loggedInUser: LoggedInUser;
}
