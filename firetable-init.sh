#!/usr/bin/env bash

set -e

export NVM_DIR=$HOME/.nvm
source $NVM_DIR/nvm.sh
nvm use 10

#set -x

ALGOLIA_APP_ID="$(grep 'ALGOLIA_APP_ID=' .env | sed 's/.*=//g')"
ALGOLIA_ADMIN_KEY="$(grep 'ALGOLIA_ADMIN_KEY=' .env | sed 's/.*=//g')"

if [ ! -d "firetable" ]; then
    git clone https://github.com/AntlerVC/firetable.git
fi

FIREBASE_ADMINSDK=${FIREBASE_ADMINSDK:-$(grep FIREBASE_ADMINSDK .env | sed 's/.*=//')}

if [ -n "$FIREBASE_ADMINSDK" ] && [ -e $FIREBASE_ADMINSDK ]; then
    cp -f $FIREBASE_ADMINSDK firetable/cloud_functions/functions/firebase-credentials.json
else
    echo "Missing Firebase Admin SDK key file"
fi

cd firetable/cloud_functions

if [ ! -e ".firebaserc" ]; then
    firebase init
    firebase functions:config:set algolia.app=$ALGOLIA_APP_ID algolia.key=$ALGOLIA_ADMIN_KEY
fi

cd functions

if [ ! -e "node_modules" ]; then
    yarn
fi