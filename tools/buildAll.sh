# Clear build and dist directory
rm -rf build
rm -rf dist
echo 'Remove previous build and dist folders'

# Make build and dist directory
mkdir build
mkdir dist
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

# Npm install
npm install --production
echo 'npm install production dependencies'

# Build Mac OS package
npm run build-darwin
echo 'Build Mac OSX app package'

# Npm install build/dev dependencies
npm install
echo 'npm install build/dev dependencies'

# Asar archive Mac OS package
npm run archive-darwin
echo 'Asar Mac OSX app package'

# Build Mac OS DMG
npm run build-dmg
echo 'Build DMG for Mac OSX app package'

# Move Mac OS Package and DMG to dist folder
cp -R ReQLPro-darwin-x64 ../dist/ReQLPro-darwin-x64
cp ReQLPro_0.0.3.dmg ../dist/ReQLPro_0.0.3.dmg
echo 'Moved Darwin package and dmg to dist folder'

# Remove Darwin package and dmg from the build folder
rm -rf ReQLPro-darwin-x64
rm -rf ReQLPro_0.0.3.dmg
echo 'Removed darwin and dmg files from build folder, this is needed to not pollute any other package builds'
