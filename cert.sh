#!/bin/bash
sudo -v
echo "Generating an SSL private key to sign your certificate..."
openssl genrsa -des3 -passout pass:x -out $1.pass.key 2048
openssl rsa -passin pass:x -in $1.pass.key -out $1.key
rm $1.pass.key

echo "Generating a Certificate Signing Request..."
openssl req -new -key $1.key -out $1.csr
 
echo "Generating certificate..."
openssl x509 -req -days 365 -in $1.csr -signkey $1.key -out $1.crt
 
echo "Copying certificate ($1.crt) to /etc/ssl/certs/"
sudo mkdir -p  /etc/ssl/certs
sudo cp $1.crt /etc/ssl/certs/
sudo chmod 644 /etc/ssl/certs/$1.crt
 
echo "Copying key ($1.key) to /etc/ssl/private/"
sudo mkdir -p  /etc/ssl/private
sudo cp $1.key /etc/ssl/private/
sudo chmod 644 /etc/ssl/private/$1.key