#!/bin/sh
date=`date "+%Y-%m-%dT%H%M%S"`
dirname=Users-$date
rsync -aP --link-dest=/Volumes/MacBackup/Users /Users/ /Volumes/MacBackup/Users-backup/$dirname
#rsync -ap --link-dest=/Volumes/MacBackup/Users /Users/ /Volumes/MacBackup/Users-backup/$dirname
rm -f /Volumes/MacBackup/Users-backup/latest
ln -s /Volumes/MacBackup/Users-backup/$dirname /Volumes/MacBackup/Users-backup/latest