#!/bin/bash

set -e

POCKETBASE_VERSION="0.40.5"
PLATFORM="linux"
ARCH="amd64"

if [[ "$OSTYPE" == "darwin"* ]]; then
  PLATFORM="darwin"
  if [[ "$(uname -m)" == "arm64" ]]; then
    ARCH="arm64"
  else
    ARCH="amd64"
  fi
fi

cd "$(dirname "$0")"

if [ ! -f "./pocketbase" ]; then
  echo "Downloading PocketBase ${POCKETBASE_VERSION}..."
  curl -L "https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_${PLATFORM}_${ARCH}.zip" -o pocketbase.zip
  unzip pocketbase.zip
  rm pocketbase.zip
  chmod +x pocketbase
  echo "PocketBase downloaded successfully"
fi

echo "Starting PocketBase server..."
./pocketbase serve
