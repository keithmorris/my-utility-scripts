#!/usr/bin/env bash

if pgrep "beam.smp" > /dev/null
	then
		echo "RabbitMQ is already running."
	else
		echo "Starting RabbitMQ"
		rabbitmq-server -detached
fi

if pgrep "mongod" > /dev/null
	then
		echo "MongoDB is already running."
	else
		echo "Starting MongoDB"
		/usr/local/bin/mongod --config /usr/local/etc/mongod.conf &		
fi

pm2 restart all