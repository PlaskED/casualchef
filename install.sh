#!/bin/bash

if [ `id -u` = 0 ] ; then
        ROOTFLAG=""
else
        ROOTFLAG="sudo"
fi

$ROOTFLAG apt install python3 python3-dev python3-pip python3-mysqldb virtualenv mysql-common mysql-server npm

if [ ! -f /instance/config.py ]; then
    echo "Creating instance folder.."
    mkdir instance #Create instance folder
    cp config.py instance/config.py #Copy config to instance folder
fi
