const apiId = 'XXXXXXXXXXXXXXXXXXX';
const env = 'v2';

export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/${env}`

export const authConfig_dev = {
  domain: 'dev-clq116aa.auth0.com',
  clientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  callbackUrl: 'http://localhost:4200/school/auth0',
  mode: 'dev'
}

export const authConfig = authConfig_dev