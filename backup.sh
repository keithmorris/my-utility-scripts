#!/bin/bash
src=/
backupPath=/Volumes/KemoBackups/backups

date=`date "+%Y-%m-%dT%H%M%S"`
dirname=backup_$date
excludeFile=/Users/kmorris/bin/backup-excludes.txt

rsync -aAXPlv --exclude-from=$excludeFile --link-dest=$backupPath/latest $src $backupPath/$dirname
rm -f $backupPath/latest
ln -s $backupPath/$dirname $backupPath/latest