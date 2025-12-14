#!/bin/bash

# Take input
read -p "Enter Title: " title
read -p "Enter Tags: " tags

# Edit temp content file in nvim
tmp=$(mktemp --suffix=".txt")
nvim "$tmp"

# Create new json object
NEW_JSON="$(
  jq -n \
    --arg title "$title" \
    --arg date "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" \
    --rawfile content "$tmp" \
    '{ title: $title, date: $date, content: $content }'
)"

jq --argjson entry "$NEW_JSON" \
   '.journal += [$entry]' \
   src/data.json > tmp.json && mv tmp.json src/data.json

exit
#Generate new index file 
cd build
./gen.sh 
cd ..

# Push and continue
git add src/data.json 
git add index.html

git commit -m "added new journal entry"


