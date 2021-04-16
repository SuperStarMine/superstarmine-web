#!/bin/bash

which -s convert
if [ "$?" != "0" ]; then
  echo 'Setup imagemagick first.'
  exit 1
fi

for img in $@
do
  for i in $(seq 2000 -250 250)
  do
    convert -resize "$i"x $img $(echo $img|awk -F '.' '{print $1}')@"$i"w.png
    convert -resize "$i"x $img -define webp:method=3,webp:sns-strength=50,webp:auto-filter=true,webp:alpha-compression=1,webp:thread-level=4,webp:use-sharp-yuv=1 $(echo $img|awk -F '.' '{print $1}')@"$i"w.webp
  done
done