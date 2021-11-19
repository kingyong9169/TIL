#!/usr/bin/env bash

git add *
git commit -m 'Update docs'
git push origin master

if [ $? -ne 1 ]; then
    echo 'commit success😀'
fi