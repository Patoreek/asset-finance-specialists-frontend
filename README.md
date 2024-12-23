## Project Overview

This project serves as the frontend component for handling asset finance operations, interfacing with a backend repository named `asset-finance-specialist-backend` which utilizes MongoDB.

## Setup

To set up the project locally:

1. **Clone the repository:**
   `git clone https://github.com/Patoreek/asset-finance-specialists-frontend.git`

2. **Install dependencies:**
   `npm install`

3. **Start the development server:**
   `npm run dev`

## Scripts

- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Test:** `npm run test`

## Environment Variables

This project uses environment variables for configuration, particularly for the `apiClient`. Ensure you have a `.env` file at the root of your project with necessary variables.

## Branches

main: Used for CI/CD deployment on AWS Amplify. All merges here should be stable features or bug fixes ready for production.
staging: Development branch where new features are integrated and tested before being merged into main.

## Deployment

AWS Amplify is used for deployment. Here's a brief outline:
Changes pushed to main trigger an automated deployment.
Ensure commits are tagged or use a specific commit message for triggering deployment if necessary.

## Backend Interaction

The app communicates with `asset-finance-specialists-backend` which uses MongoDB. Ensure that your backend server is running or accessible for local development testing.
