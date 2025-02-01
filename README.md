# Frontend Delegate Mini Website for SIDAN Lab Governance Discord Bot

This is the mini website for SIDAN Lab Governance Discord Bot, used for delegation and verification of users.

## Getting Started

### Installation
```shell
yarn # or npm install
```

### Environment Variables
Create a `.env` file in the workspace repository and set the environment variables according to `.env.example`

Currently, the environment variable `NEXT_PUBLIC_SIDAN_DREP_ID_129` is not used, since the drep delegate certificate in mesh transaction builder only supports CIP-105 for now.

### Running the web app

The application will start on http://localhost:3001 by default.

```shell
yarn dev # or npm run dev
```

### Deployment
We are using Vercel for deployment. The deployment is done automatically when a PR is merged into the `main` branch.