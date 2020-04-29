#!/usr/bin/env bash
set -e
#find the location of the script, not the current directory
file="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
#change to the script location, before continuing
pushd $file

npm run build
cp -R ../../../node_modules ../../../dist/node_modules
sam local invoke "NewrelicServerlessStressTest" -t NewrelicServerlessStressTest.yaml --no-event
rm -R ../../../dist/node_modules
popd
