// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
// const apiId = '2xedbri4g3';
// const env = 'v1';

const apiId = 'i83xvf3lfg';
const env = 'v2';

export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/${env}`

export const authConfig = {
  domain: 'dev-clq116aa.auth0.com',
  clientId: 'm5kcfvSg0i5ZTY2ei8uOM6mb2Z1TrzGS',
  callbackUrl: 'http://localhost:4200/school/auth0'
}


