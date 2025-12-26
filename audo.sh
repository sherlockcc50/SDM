#!/bin/bash

# Ask for commit message
read -p "Enter commit message: " commit_message

# Initialize git repo if not already
if [ ! -d ".git" ]; then
  git init
  git branch -M main
  git remote add origin https://github.com/sherlockcc50/SDM.git
fi

# Add all changes (respects .gitignore)
git add .

# Commit with the provided message
git commit -m "$commit_message"

# Push to remote
git push -u origin main
