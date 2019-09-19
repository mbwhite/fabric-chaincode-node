#!/bin/bash -e
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

######################################
# Publish npm module after merge commit
# npm publish --tag $CURRENT_TAG
######################################

npmPublish() {
  if [[ "$CURRENT_TAG" = *"skip"* ]]; then
      echo "----> Don't publish npm modules on skip tag"
  elif [[ "$CURRENT_TAG" = *"unstable"* ]]; then
      echo
      UNSTABLE_VER=$(npm dist-tags ls "$1" | awk "/$CURRENT_TAG"":"/'{
      ver=$NF
      sub(/.*\./,"",rel)
      sub(/\.[[:digit:]]+$/,"",ver)
      print ver}')

      echo "======> UNSTABLE VERSION:" $UNSTABLE_VER
# Increment unstable version here
      UNSTABLE_INCREMENT=$(npm dist-tags ls "$1" | awk "/$CURRENT_TAG"":"/'{
      ver=$NF
      rel=$NF
      sub(/.*\./,"",rel)
      sub(/\.[[:digit:]]+$/,"",ver)
      print ver"."rel+1}')

      echo "======> Incremented UNSTABLE VERSION:" $UNSTABLE_INCREMENT

      # Get last digit of the unstable version of $CURRENT_TAG
      UNSTABLE_INCREMENT=$(echo $UNSTABLE_INCREMENT| rev | cut -d '.' -f 1 | rev)
      echo "======> UNSTABLE_INCREMENT:" $UNSTABLE_INCREMENT

      # Append last digit with the package.json version
      export UNSTABLE_INCREMENT_VERSION=$RELEASE_VERSION.$UNSTABLE_INCREMENT
      echo "======> UNSTABLE_INCREMENT_VERSION:" $UNSTABLE_INCREMENT_VERSION

      # Replace existing version with $UNSTABLE_INCREMENT_VERSION
      sed -i 's/\(.*\"version\"\: \"\)\(.*\)/\1'$UNSTABLE_INCREMENT_VERSION\"\,'/' package.json
      npm publish --tag $CURRENT_TAG

  else
      # Publish node modules on latest tag
      echo -e "\033[32m ======> RELEASE_VERSION: $RELEASE_VERSION" "\033[0m"
      echo
      echo -e "\033[32m ======> CURRENT_TAG: $CURRENT_TAG" "\033[0m"
      npm publish --tag $CURRENT_TAG
  fi
}
versions() {

  CURRENT_TAG=$(cat package.json | grep tag | awk -F\" '{ print $4 }')
  echo -e "\033[32m ======> CURRENT_TAG: $CURRENT_TAG" "\033[0m"

  RELEASE_VERSION=$(cat package.json | grep version | awk -F\" '{ print $4 }')
  echo -e "\033[32m ======> Current RELEASE_VERSION:" "\033[0m"
}

ROOT=$WORKSPACE/gopath/src/github.com/hyperledger/fabric-chaincode-node
npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN

cd ${ROOT}/apis/fabric-shim-api
versions
echo -e "\033[32m ======> fabric-shim-api" "\033[0m"
npmPublish fabric-shim-api

cd ${ROOT}/libraries/fabric-shim
versions
echo -e "\033[32m ======> fabric-shim" "\033[0m"
npmPublish fabric-shim

cd ${ROOT}/libraries/fabric-shim-crypto
versions
echo -e "\033[32m ======> fabric-shim-crypto" "\033[0m"
npmPublish fabric-shim-crypto

cd ${ROOT}/api/fabric-contract-api
versions
echo -e "\033[32m ======> fabric-contract-api" "\033[0m"
npmPublish fabric-contract-api
