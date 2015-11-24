#!/usr/bin/env bash
sudo kextunload -b com.apple.iokit.BroadcomBluetoothHostControllerUSBTransport
sleep 2
sudo kextload -b com.apple.iokit.BroadcomBluetoothHostControllerUSBTransport
