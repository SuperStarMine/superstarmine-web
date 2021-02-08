#!/bin/bash
#This script works on BSD systems.
files="index.html"
if [ $# -gt 0 ]; then
  files="$@"
fi

for file in $files
do
  echo -n "### "$'\e[32m'$file$'\e[0m '
  printf "%0*d\n\n" $(echo $(tput cols)-5-$(echo $file|tr -d '\n'|wc -m)|bc)|tr '0' '#'
  for i in $(cat ./cache-busting_targets.txt)
  do
    grep "$i" "$file" > /dev/null 2>&1
    if [ $? = 0 ]; then
      echo $'\e[36m'$i$'\e[0m'
      echo -e $(grep "$i" "$file" 2>/dev/null|awk '{match($0, /h=[a-zA-Z0-9]{6}/);print substr($0, RSTART, RLENGTH)}')
      echo -e "> "$(sha256sum "$i"|awk '{print substr($1, 0, 6)}')"\n"
      IFS=$"\n"
      for line in $(grep "$i" "$file")
      do
        # echo -e ${line}|tr '\n' ' '|sed -E 's/\>\ \</>a</g'
        printf $line
        # sed -i '' "s/$(echo "$line"|awk '{match($0, /h=[a-zA-Z0-9]{6}/);print substr($0, RSTART, RLENGTH)}')/h=$(sha256sum "$i"|awk '{print substr($1, 0, 6)}')/g" "$file"
        # sed "s/$(echo "$line"|awk '{match($0, /h=[a-zA-Z0-9]{6}/);print substr($0, RSTART, RLENGTH)}')/h=$(sha256sum "$i"|awk '{print substr($1, 0, 6)}')/g" "$file"
      done
      echo
      unset IFS
    fi
  done
done