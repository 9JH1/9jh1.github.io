#!/bin/bash 
rm gen
gcc -o gen generate.c remote/plib/plib.c remote/cJSON/cJSON.c -O2 -Wextra -Wall
time ./gen -i="../src/base.html" -j="../src/data.json" --buff=256 > "../index.html" && echo "Generated Successfully"
