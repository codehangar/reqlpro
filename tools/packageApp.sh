# Make _dist directory
mkdir _dist

# copy all needed source files
cp main.js ./_dist/main.js
cp -R main ./_dist/main
cp package.json ./_dist/package.json
mkdir ./_dist/public
cp ./public/index.html ./_dist/public/index.html
cp ./public/dist.js ./_dist/public/dist.js
cp -R ./public/dist_files ./_dist/public/dist_files
cd _dist
npm install
cd ..

# run command to package app
echo "Lets make the app"
electron-packager ./_dist ReQLPro --platform=darwin --arch=x64 --overwrite

# delete _dist folder
rm -r _dist

# we are done
echo "App packaged successfully"