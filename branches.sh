#!/bin/bash
HOME_PATH=/home/jenkins/repo-branches/$1/$2
#PROP_FILE=$HOME_PATH/branches.properties
PROP_FILE=./branches.properties
git fetch --all
git pull
git remote prune origin 
# echo -ne "branches=" > $PROP_FILE
# git branch -r | awk '/origin\/(feature|bugfix|develop|master)/{printf "%s,", $1 }' | head #>> $PROP_FILE
git branch -r | awk '/origin\//{printf "%s,", $1 }' #| head #>> $PROP_FILE
# echo "" >> $PROP_FILE





# HOME_PATH=/opt/jenkins/repo-branches/$1/$2
# PROP_FILE=$HOME_PATH/branches.properties
# cd $HOME_PATH
# git fetch --all
# git pull
# git remote prune origin 
# echo -ne "branches=" > $PROP_FILE
# git branch -r | awk '/origin\/(feature|bugfix|develop|master)/{printf "%s,", $1 }' | head >> $PROP_FILE
# echo "" >> $PROP_FILE


# branches.sh VZW-ISO omni-vzw.moxieinteractive.com


# /home/jenkins/repo-branches/VZW-OMNI/omni-vzw.moxieinteractive.com/branches.properties

# SCRIPT ON JENKINS SERVER

#!/bin/bash
# HOME_PATH=/home/jenkins/repo-branches/$1/$2
# PROP_FILE=$HOME_PATH/branches.properties
# PROP_FILE=./branches.properties
# cd $HOME_PATH
# pwd
# git fetch --all
# git pull
# git remote prune origin
# echo -ne "branches=" > $PROP_FILE
# git branch -r | awk '/origin\//{printf "%s,", $1 }' | head >> $PROP_FILE
# echo "" >> $PROP_FILE
