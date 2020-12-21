#!/bin/sh
#This script works on BSD systems.
files="index.html"
if [ $# -gt 0 ]; then
  files="$@"
fi

for file in "$files"
do
  echo "$file""\n"
  for i in $(cat ./cache-busting_targets.txt)
  do
    echo "$i""\n"$(grep "$i" "$file"|awk '{match($0, /h=[a-zA-Z0-9]{6}/);print substr($0, RSTART, RLENGTH)}')"\n> "$(sha256sum "$i"|awk '{print substr($1, 0, 6)}')"\n"
    sed -i '' "s/$(grep "$i" "$file"|awk '{match($0, /h=[a-zA-Z0-9]{6}/);print substr($0, RSTART, RLENGTH)}')/h=$(sha256sum "$i"|awk '{print substr($1, 0, 6)}')/g" "$file"
  done
done