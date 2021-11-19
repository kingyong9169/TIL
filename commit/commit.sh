#!/usr/bin/env bash

git add *
git commit -m 'Update docs'
git push origin main

if [ $? -ne 1 ]; then
    echo 'commit success😀'
fi