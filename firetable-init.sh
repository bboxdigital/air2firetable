#!/usr/bin/env bash

set -e

if [ ! -d "firetable" ]; then
    git clone https://github.com/AntlerVC/firetable.git
fi

if [ -n "$(ls *firebase-adminsdk*.json 2> /dev/null)" ]; then
    cp -f *firebase-adminsdk*.json firetable/cloud_functions/functions/
else
    echo "Missing Firebase Admin SDK key file"
fi

cd firetable/cloud_functions

if [ ! -e ".firebaserc" ]; then
    firebase init
fi

cd functions

if [ ! -e "lib" ]; then
    npm run build
fi