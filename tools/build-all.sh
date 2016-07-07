# Clear build and dev directory
rm -rf build
rm -rm dev
echo 'Remove previous build and dev folders'

# Run webpack to make sure the newest code is compiled
webpack
echo 'Webpack compile code before packaging'

# Make build and dist directory
mkdir build
echo 'Create new empty build and dist folders'

# Copy over build.json and rename it package.json
cp build.json ./build/package.json
echo 'Copy build.json to build folder renamed to package.json'

# Copy over main file
cp main.js ./build/main.js
echo 'Copy main.js file to root of build folder'

# Copy over dev folder
cp -R dev/ ./build/dev/
echo 'Copy dev folder to root of build folder'

# Copy over main folder
cp -R main/ ./build/main/
echo 'Copy main folder to root of build folder'

# Change working directory to npm install
cd build
echo 'Change working directory to build folder'

# Npm install production dependencies
npm install --production
echo 'npm install production dependencies'

# Build All packages
npm run build-packages
echo 'Build all app packages'

# Move icon into Mac OSX package (Mac Specific extra step)
npm run icon-darwin
echo 'Moved mac supported icon into mac package'

# Npm install build/dev dependencies
npm install
echo 'npm install build/dev dependencies'

# Asar archive Mac OS package
npm run archive-darwin
echo 'Asar Mac OSX app package'

# Build Mac OS DMG
npm run build-dmg
echo 'Build DMG for Mac OSX app package'

# Asar archive windows packabe
npm run archive-windows
echo 'Asar windows app package'

# # Build Windows Installer
# npm run build-windows-installer
# echo 'Build windows installer for windows package'

