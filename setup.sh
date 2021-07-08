#!/bin/sh
rm -rf node_modules
npm i
cd projects/sunbird-video-player
rm -rf node_modules
npm i
cd ../..
npm run build-lib
cd dist/sunbird-video-player
npm link
cd ../..
npm link @project-sunbird/sunbird-video-player-v9
