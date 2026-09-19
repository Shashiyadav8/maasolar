#!/usr/bin/env bash
# exit on error
set -o errexit

# Install standard dependencies and build the frontend
npm install
npm run build

# Install Puppeteer dependencies for Render
# Render runs on Ubuntu/Debian, so we use apt-get to install missing OS libraries required for Chromium
# https://render.com/docs/puppeteer
if [[ $RENDER == "true" ]]; then
  echo "Installing Puppeteer dependencies for Render..."
  
  # Store current directory
  STORE_DIR=$(pwd)
  
  # Define cache directory for puppeteer
  PUPPETEER_CACHE_DIR=/opt/render/project/puppeteer
  
  export PUPPETEER_CACHE_DIR=$PUPPETEER_CACHE_DIR
  
  # Ensure cache directory exists
  mkdir -p $PUPPETEER_CACHE_DIR
  
  # Install puppeteer specifically to ensure the browser gets downloaded to the cache
  cd server
  npm install puppeteer
  npx puppeteer browsers install chrome
  
  # We're using the standard puppeteer package which handles the binary, but we might need OS libs
  # Note: Render usually handles these automatically if you use the right build command,
  # but some might still be missing. The official Render way is to just let npm install handle it,
  # and if it fails, contact support to add the OS libs. However, we'll try to be safe.
  
  cd $STORE_DIR
fi

echo "Build complete."
