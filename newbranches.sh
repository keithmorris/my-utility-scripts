#!/bin/bash
URL=$1

ORIG_IFS=$IFS # Keep original Internal Field Separator (IFS)
IFS="/"
read -a array <<< "$URL"
IFS=$ORIG_IFS # Restore original IFS

PROJECT=`echo ${array[${#array[@]} - 2]} | awk '{print toupper($0)}'`
REPO=`echo ${array[${#array[@]} - 1]} | sed 's/.git//g'`
#HOME_PATH=/home/jenkins/repo-branches/$PROJECT/$REPO
HOME_PATH=~/bin/$PROJECT/$REPO
mkdir -p $HOME_PATH
PROP_FILE=$HOME_PATH/branches.properties
echo -ne "branches=" > $PROP_FILE
git ls-remote --heads $URL | awk '{printf "%s,", $2 }' | sed 's/refs\/heads/origin/g' | head >> $PROP_FILE
echo "" >> $PROP_FILE

