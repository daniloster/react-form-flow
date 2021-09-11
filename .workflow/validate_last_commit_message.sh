#!/bin/bash
set -u
set -e
get_latest_tag() {
  git describe --tags --abbrev=0 2> /dev/null
}

export LAST_TAG="$(get_latest_tag)"
export ALL_COMMIT="$(git rev-list HEAD -- .)"
export INITIAL_COMMIT="$(git rev-list HEAD -- . | tail -1)"

if [[ "$LAST_TAG" == "" ]]; then
    export FROM_VERSION="$INITIAL_COMMIT"
else
    export FROM_VERSION="$LAST_TAG"
fi

export COMMENTS="$(git log --format=%B $FROM_VERSION..HEAD | cat)"

if [[ $COMMENTS == *"[release]"* ]] && [[ $COMMENTS == *"[major]"* ]]; then
  echo '** Versioning to MAJOR'
elif [[ $COMMENTS == *"[release]"* ]] && [[ $COMMENTS == *"[minor]"* ]]; then
  echo '** Versioning to MINOR'
elif [[ $COMMENTS == *"[release]"* ]] && [[ $COMMENTS == *"[patch]"* ]]; then
  echo '** Versioning to PATCH'
else
  echo '** NOT VERSIONING'
fi

exit 0
