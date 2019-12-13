import { SystemParam } from './systemParam';

export interface UserPostDTO  extends SystemParam {

    aca_id?: number;
    login_id?: string;
    post_id?: number;
    post_name?: string;
    post_level?: string;
    unit_id?: string;
    unit_name?: string;
    displayPostName?: string;
    postType?: string;
    school_login_or_unit_id?: string;
}
