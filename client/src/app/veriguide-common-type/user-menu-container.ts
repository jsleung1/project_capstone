import { LoggedInUser } from '../veriguide-model/models';
import { TopMenuItem } from './top-menu-item';
import { ContentMenuItem } from './content-menu-item';

export class UserMenuContainer {
    topMenuItems: TopMenuItem[] = new Array();
    contentMenuItems: ContentMenuItem[] = new Array();
    loggedInUser: LoggedInUser;
}
