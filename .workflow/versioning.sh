#!/bin/bash
set -u
# -u abort script for unbounded variables

export PACKAGE_NAME="$(cat package.json| grep "\"name\": \"" | awk '{print $2}' | cut -d \" -f 2)"

# Checking if it is a master commit with release attribute
if [[ $GITHUB_EVENT_NAME == 'push' ]]; then
  echo '** Setting github user'
  git config --global user.email "daniloster@gmail.com"
  git config --global user.name "Danilo Castro"
  export GIT_REPO="github.com/${GIT_PATH}.git"
  echo "GIT REPO: $GIT_REPO"
  git remote add gh-publish "https://${GIT_AUTH_TOKEN}@${GIT_REPO}"
  git fetch gh-publish
  git checkout master
  git rebase gh-publish/master

  confirm_bump() {
    echo "BUMPING PACKAGE [$PACKAGE_NAME] TO [$NEW_VERSION]"
    echo $NEW_VERSION | ./.workflow/bump_version.sh
    yarn build:storybook
    git add package.json
    git add docs
    export COMMIT_VERSION_MESSAGE="[skip ci] v$NEW_VERSION"
    git commit -m "$COMMIT_VERSION_MESSAGE"
    LAST_COMMIT_FOR_TAGGING="$(git log --oneline --no-merges -n 1 | awk '{print $1}')"
    echo "Adding tag to last commit: $LAST_COMMIT_FOR_TAGGING"

    git tag -a "v$NEW_VERSION" "$LAST_COMMIT_FOR_TAGGING" -m "$COMMIT_VERSION_MESSAGE"

    git push gh-publish master
    git push --tags gh-publish master

    echo '** Generating npm auth'
    echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" >> ~/.npmrc

    npm publish

    git push origin master

    rm -rf ~/.npmrc
  }

  get_latest_tag() {
    git describe --tags --abbrev=0 2> /dev/null
  }

  export LAST_TAG="$(get_latest_tag)"
  export INITIAL_COMMIT="$(git rev-list HEAD -- . | tail -1)"

  if [[ "$LAST_TAG" == "" ]]; then
      export FROM_VERSION="$INITIAL_COMMIT"
  else
      export FROM_VERSION="$LAST_TAG"
  fi

  export COMMENTS="$(git log --format=%B $FROM_VERSION..HEAD)"

  if [[ $COMMENTS == *"[release]"* ]] && [[ $COMMENTS == *"[major]"* ]]; then
    echo '** Versioning - MAJOR'
    export NEW_VERSION="$(echo "major" | ./.workflow/get_bump_version.sh)"
    
    confirm_bump
  elif [[ $COMMENTS == *"[release]"* ]] && [[ $COMMENTS == *"[minor]"* ]]; then
    echo '** Versioning - MINOR'
    export NEW_VERSION="$(echo "minor" | ./.workflow/get_bump_version.sh)"

    confirm_bump
  elif [[ $COMMENTS == *"[release]"* ]] && [[ $COMMENTS == *"[patch]"* ]]; then
    echo '** Versioning - PATCH'
    export NEW_VERSION="$(echo "patch" | ./.workflow/get_bump_version.sh)"

    confirm_bump
  elif [[ $COMMENTS == *"[docs]"* ]]; then
    echo '** Versioning - DOCS'

    yarn build:storybook
    
    git add docs
    export COMMIT_VERSION_MESSAGE="[skip ci] docs"
    git commit -m "$COMMIT_VERSION_MESSAGE"
    git push gh-publish master
  else
    echo '** NOT RELEASED'
  fi

fi