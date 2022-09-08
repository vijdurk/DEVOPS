#!/bin/bash

# Exit on error
set -e

# Trace commands while running:
# set -x

# Print error message and exit with error code 1
function die {
    echo "$1"
    exit 1
}

# Check the number of arguments
[ $# -ge 2 ] || die "usage: $0 <playbook> <inventory>"

PLAYBOOK=$1
INVENTORY=$2
TAG=$3

if [[ $TAG == package || $TAG == remove ]]
then
    ansible-playbook $PLAYBOOK -i $INVENTORY --tags $TAG -e "PACKAGES=${@:4}"
elif [[ $TAG == repository ]]
then
    ansible-playbook $PLAYBOOK -i $INVENTORY --tags $TAG -e "ARG=$4" -e "DIR=$5" -e "VM_USER=$6"
elif [[ $TAG == mutation-* ]]
then
    ansible-playbook $PLAYBOOK -i $INVENTORY --tags $TAG -e "VM_USER=$4" -e "DIR=$5" -e "ITERATION=$6" -e "URLS=$7"
else
    ARG=${@:4}
    ansible-playbook $PLAYBOOK -i $INVENTORY --tags $TAG -e "ARG=$ARG"
fi