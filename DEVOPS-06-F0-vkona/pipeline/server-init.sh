#!/bin/bash

# Exit on error
set -e

# Trace commands as we run them:
set -x

sudo timedatectl set-ntp off
sudo timedatectl set-ntp on

# Script used to initialize ansible server after provisioning.
sudo add-apt-repository ppa:ansible/ansible -y
sudo apt-get update
sudo apt-get install ansible -y

chmod 600 ~/.ssh/baker_rsa
chmod 600 ~/.ssh/devops_rsa
