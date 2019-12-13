export class LoggedInUser {
    authenticationState: AuthenticationStateEnum;
    email?: string;
    userName?: string;
    userType?: string;
    accessToken?: string;
    idToken?: string;
}
export type AuthenticationStateEnum = 'needToLogin' | 'authenticated';
export const AuthenticationStateEnum = {
    NeedToLogin: 'needToLogin' as AuthenticationStateEnum,
    Authenticated: 'authenticated' as AuthenticationStateEnum
};
