export class LoggedInUser {
    authenticationState: AuthenticationStateEnum;
    userId?: string;
    email?: string;
    userName?: string;
    userType?: string;
    accessToken?: string;
    idToken?: string;
}
export type AuthenticationStateEnum = 'needToLogin' | 'needToCreate' | 'authenticated';
export const AuthenticationStateEnum = {
    NeedToLogin: 'needToLogin' as AuthenticationStateEnum,
    NeedToCreate: 'needToCreate' as AuthenticationStateEnum,
    Authenticated: 'authenticated' as AuthenticationStateEnum
};
