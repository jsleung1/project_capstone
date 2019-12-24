# Udacity Capstone Project for Cloud Developer
Capstone Project: VeriMarker 

Project Demo Url: https://www.verimarker.com

## Introduction:
VeriMarker is a plagiarism detection system used by both students and instructors to manage submissions, assignments and courses, with the primary goal to ensure students did not plagiarized their work.  

Using VeriMarker, student can submit files to the course assignments, view the similarity result, grades, and instructor’s comments of their own submissions, and download the files of their own past submissions.  Instructor can create and manage their own courses, assignments, and comment / grade the student’s submissions uploaded to their own assignments.  For the purpose of the capstone project, the similarity result of the student’s submission is only a simulated number created by Math.random.

## Implementation:
“Option 2” was selected for the Udacity Cloud Developer Capstone project.  The backend was implemented using Serverless and AWS Lambda functions as taught in the project under Course 5 “Develop & Deploy Serverless App”.  The client is a Single Page Application written in Angular 8.  The Angular client was deployed to AWS S3 / CloudFront with the help of Route 53.  The deployed URL is https://www.verimarker.com

## Important:
- Please refer to the pdf file: [**project_capstone_rubrics_verimarker**](https://github.com/jsleung1/serverless_application/blob/master/project_capstone_rubrics_verimarker.pdf) in the main project folder for the project screenshots and meeting the rubrics.  The document contains detail description of the Unit Tests in Section 3, and how to meet the rubrics in Section 4.  In addition, it provides information on how to get started in the Demo project in section 1.

- Rubrics:
https://review.udacity.com/#!/rubrics/2578/view

## Setup Instructions:
Please use the following settings in the config.ts of the client in order to test our serverless application:
```
const apiId = 'lh756iw3bi';
const env = 'v2';

export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/${env}`
/*
export const authConfig_prod = {
  domain: 'dev-clq116aa.auth0.com',
  clientId: 'QLaMP23u6l9whbZWmXf6PTF9eKxMSVU8',
  callbackUrl: 'https://www.verimarker.com/school/auth0',
  mode: 'prod'
}
*/
export const authConfig_dev = {
  domain: 'dev-clq116aa.auth0.com',
  clientId: 'Z52r8N5nV8h3XvWr3jqZJm9wE3JWi6yq',
  callbackUrl: 'http://localhost:4200/school/auth0',
  mode: 'dev'
}

export const authConfig = authConfig_dev
```
Path to download the certification for authorization using Auth0 and JWT:
https://dev-clq116aa.auth0.com/.well-known/jwks.json'

The Postman REST API for VeriMarker can be imported from the file: [**capstone_project.postman_collection.json**](https://github.com/jsleung1/project_capstone_verimarker/blob/master/capstone_project.postman_collection.json).

To run the Angular client, please perform the following steps:

1.	Execute: git clone https://github.com/jsleung1/project_capstone_verimarker.git
2.	In Visual Studio Code, open the parent project folder “project_capstone_verimarker”.
3.	Open terminal in Visual Studio code, and cd to the client folder (project_capstone_verimarker/client).
4.	In the client folder, install latest Angular by execute: npm install -g @angular/cli (you can try install Angular locally only to the project by: npm install @angular/cli ,but you need additional setup for that to work).


