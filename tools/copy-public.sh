#!/bin/sh
#This script works on BSD systems.

d=$(pwd)
cd $(cd $(dirname $BASH_SOURCE); pwd)

pwd

cd ../
cp index.html public/
cp favicon.ico public/
cp global.css public/
cp -r img/ public/img/
cp -r video/ public/video/
cp -r font/ public/font/
