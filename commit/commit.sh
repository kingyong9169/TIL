#!/usr/bin/env bash

git add *
git commit -m '⚽️ Update TIL'
git push origin main

if [ $? -ne 1 ]; then
    echo 'commit success😀'
fi