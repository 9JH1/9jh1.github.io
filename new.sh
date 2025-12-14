#!/bin/bash

# Take input
read -p "Enter Title: " title
read -p "Enter Tags: " tags

# Edit temp content file in nvim
tmp=$(mktemp --suffix=".txt")
nvim "$tmp"

# Get json var
read -r -d '' JSON << EOM 
{
	"title": "$title",
	"date": "$(date -u '+%Y-%m-%dT%H:%M:%SZ')",
	"content": "$(cat "$tmp")"
}
EOM

# Write new json and push new data
jq --argjson d "$JSON" '.journal+=[$d]' src/data.json > "src/data.json"

# Generate new index file 
cd build
./gen.sh 
cd ..

# Push and continue
git add src/data.json 
git add index.html

git commit -m "added new journal entry"
git push

echo "Done!"
