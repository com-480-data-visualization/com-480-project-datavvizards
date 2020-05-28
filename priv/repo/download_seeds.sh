#!/bin/bash

#This script is called from seeds.exs
#Can be invoked with mix ecto.reset from the top level directory

prefix="$(pwd)/priv/repo/"
if [ ! -d $prefix"/seeds" ]; then
    wget https://datavvizards.s3.eu-west-3.amazonaws.com/seeds.zip -P $prefix
    unzip $prefix"/seeds.zip" -d $prefix
fi

