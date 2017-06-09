#!/usr/bin/env bash
sudo find . -iname ".DS_Store" -depth -exec rm -v {} \;
