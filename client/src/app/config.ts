// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '2xedbri4g3';
const env = 'v1';

export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/${env}`

export const authConfig = {
  domain: 'dev-clq116aa.auth0.com',
  clientId: '4sEZn6wm2j16hPYQvwlqcXxyZGy5w7Iz',
  callbackUrl: 'http://localhost:4200/school/main/auth0'
}


