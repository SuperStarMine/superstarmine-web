#!/bin/sh
#This script works on BSD systems.

d=$(pwd)
cd $(cd $(dirname $BASH_SOURCE); pwd)

pwd

cd ../
cp index.html public/
