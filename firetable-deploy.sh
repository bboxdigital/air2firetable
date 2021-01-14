#!/usr/bin/env bash

set -e

export NVM_DIR=$HOME/.nvm
source $NVM_DIR/nvm.sh
nvm use 10

set -x

if [ ! -e "firetable" ]; then
    ./firetable-init.sh
fi

cd firetable/cloud_functions/functions

GSED="$(which gsed)"
SED=${GSED:-sed}

cleanup () {
    git checkout -- .
    rm src/functionConfig.ts
    $SED -i "s/\/\/const serviceAccount/const serviceAccount/" src/generateConfig.ts 
    $SED -i "s/\/\/admin.initializeApp/admin.initializeApp/" src/generateConfig.ts
    $SED -i "s/admin.initializeApp()/\/\/admin.initializeApp()/" src/generateConfig.ts
}

collections=( test )

#for function in actionScript webhook; do
#    cleanup && yarn && firebase deploy --only functions:$function
#done

function=FT_algolia
for collection in "${collections[@]}"; do
    cleanup && cat > src/functionConfig.ts <<EOF
export default {
    name: "$collection",
    fieldsToSync: ["shortText", "longText"]
};
export const collectionPath = "$collection";
export const functionName = collectionPath
  .replace("-", "_")
  .replace(/\//g, "_")
  .replace(/_{.*?}_/g, "_");
EOF
    yarn && firebase deploy --only functions:$function
done

#function=FT_derivatives
#for collection in "${collections[@]}"; do
#    cleanup && yarn && yarn generateConfig $function $collection && firebase deploy --only functions:$function
#done

#function=FT_aggregates
#for collection in "${collections[@]}"; do
#    cleanup && yarn && yarn generateConfig $function $collection && firebase deploy --only functions:$function
#done

#function=FT_subTableStats
#for collection in "${collections[@]}"; do
#    cleanup && yarn && yarn generateConfig $function $collection && firebase deploy --only functions:$function
#done