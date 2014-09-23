#!/usr/bin/env bash
git filter-branch -f --msg-filter 'sed -e "/git-svn-id:/d"';