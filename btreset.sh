#!/usr/bin/env bash

until blueutil -p off
do
    echo "Timed out. Trying again.";
done
sleep 2
blueutil -p on

