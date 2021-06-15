# air2firetable

Tools for importing data from Airtable to Firetable

## Quick Start

1. `npm install`
2. `cp .env.example .env` and fill it out
3. Save your [Firebase Admin SDK Key](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk) in this directory and set the `FIREBASE_ADMINSDK` value in `.env` to its path
4. `npm run all`

## Algolia functions

The Algolia Cloud Functions are used to update the Algolia Index.

You will first need to configure and log in with the Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
```

Then run this command and follow instructions:
```bash
./firetable-deploy.sh
```

## Running as a service

This is a sample SystemD service config:
```ini
[Unit]
Description=Run air2firetable periodically
After=network.target

[Service]
Restart=always
RestartSec=60
User=air2firetable
WorkingDirectory=/home/air2firetable/air2firetable
ExecStart=/home/air2firetable/.nvm/versions/node/v14.17.0/bin/node /home/air2firetable/air2firetable/lib/service.js

[Install]
WantedBy=multi-user.target
```
