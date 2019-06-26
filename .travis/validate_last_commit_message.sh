#!/bin/bash

# Validating if it is a PR
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  export LAST_TAG="$(git describe --tags --abbrev=0)"
  export INITIAL_COMMIT="$(git rev-list HEAD | tail -n 1)"

  if [[ "$LAST_TAG" == "" ]]; then
      export FROM_VERSION="$INITIAL_COMMIT"
  else
      export FROM_VERSION="$LAST_TAG"
  fi

  export COMMENTS="$(git log $FROM_VERSION..HEAD --oneline)"
  if [[ $COMMENTS == *"[release=major]"* ]]; then
    echo '** Releasing MAJOR'
  elif [[ $COMMENTS == *"[release=minor]"* ]]; then
    echo '** Releasing MINOR'
  elif [[ $COMMENTS == *"[release=patch]"* ]]; then
    echo '** Releasing PATCH'
  else
    echo '** NOT RELEASED'
  fi

  exit 0
fi