#!/usr/bin/env bash

date=`date +%s`

mv .git ../git-$date && rm -fr *
mv ../git-$date ./.git
mv .git/* .
rmdir .git

git config --bool core.bare true