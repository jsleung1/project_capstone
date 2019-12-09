# Udacity Project 5: 
Project 5: Serverless Application Project

## Important:
- Please refer to the pdf file: [**project5_rubrics.pdf**](https://github.com/jsleung1/serverless_application/blob/master/project5_rubrics.pdf) in the main project folder for the project screenshots and meeting the rubrics.

- Rubrics:
https://review.udacity.com/#!/rubrics/2574/view

## Setup Instructions:
Please use the following settings in the config.ts of the client in order to test our serverless application:
```
const apiId = 'qbasdfm88e'

export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-clq116aa.auth0.com',
  clientId: 'j89rVwvRORYSRJbXWAGRCWk25TeB8FdO',
  callbackUrl: 'http://localhost:3000/callback'
}
```
Path to download the certification for authorization using Auth0 and JWT:
https://dev-clq116aa.auth0.com/.well-known/jwks.json'

